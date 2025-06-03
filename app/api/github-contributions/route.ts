import { NextResponse } from "next/server"

const GITHUB_API_URL = "https://api.github.com/graphql"
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

// Interfaces for GitHub API response structure
interface GitHubContributionDay {
  contributionCount: number
  date: string
  weekday: number
  color: string // GitHub's color, not directly used by us but part of the response
}

interface GitHubWeek {
  contributionDays: GitHubContributionDay[]
}

interface GitHubContributionCalendar {
  totalContributions: number
  weeks: GitHubWeek[]
}

// Interface for the expected structure within the 'data' object of the GraphQL response
interface GitHubUserData {
  user?: {
    contributionsCollection?: {
      contributionCalendar: GitHubContributionCalendar
    }
  }
}

// Interface for the overall GitHub GraphQL API response
interface GitHubGraphQLResponse {
  data?: GitHubUserData
  errors?: Array<{
    message: string
    type?: string
    path?: string[]
    locations?: Array<{ line: number; column: number }>
  }>
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  if (!GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN is not set on the server.")
    return NextResponse.json({ error: "Server configuration error: Missing GitHub token." }, { status: 500 })
  }

  const query = `
    query($userName: String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
                color
              }
            }
          }
        }
      }
    }
  `

  try {
    const githubApiResponse = await fetch(GITHUB_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables: { userName: username },
      }),
    })

    if (!githubApiResponse.ok) {
      // Attempt to get more detailed error from GitHub's response body
      const errorBody = await githubApiResponse.text()
      console.error(
        `GitHub API HTTP error for ${username}: ${githubApiResponse.status} ${githubApiResponse.statusText}`,
        errorBody,
      )
      return NextResponse.json(
        { error: `Failed to fetch data from GitHub: ${githubApiResponse.statusText}. Details: ${errorBody}` },
        { status: githubApiResponse.status },
      )
    }

    const githubJson: GitHubGraphQLResponse = await githubApiResponse.json()

    // Check for GraphQL errors returned in the response body (even with HTTP 200 OK)
    if (githubJson.errors && githubJson.errors.length > 0) {
      console.error(`GitHub API returned GraphQL errors for ${username}:`, JSON.stringify(githubJson.errors, null, 2))
      return NextResponse.json(
        { error: `GitHub API error: ${githubJson.errors.map((e) => e.message).join(", ")}` },
        { status: 400 }, // Or 500, depending on the nature of the error
      )
    }

    const contributionCalendar = githubJson.data?.user?.contributionsCollection?.contributionCalendar

    if (contributionCalendar) {
      const contributionDays = contributionCalendar.weeks.reduce(
        (acc: GitHubContributionDay[], week) => acc.concat(week.contributionDays),
        [],
      )
      const totalContributions = contributionCalendar.totalContributions

      return NextResponse.json({
        contributions: contributionDays,
        totalContributions: totalContributions,
        weeks: contributionCalendar.weeks.length,
      })
    } else {
      // Log the entire structure if the expected path is not found
      console.warn(
        `No contribution data found for user ${username} or unexpected API response structure. Full GitHub response:`,
        JSON.stringify(githubJson, null, 2), // Stringify for better logging
      )
      return NextResponse.json(
        {
          error:
            "No contribution data found from GitHub or unexpected API response structure. Check server logs for details.",
        },
        { status: 404 },
      )
    }
  } catch (error: any) {
    console.error(`Error in API route for GitHub contributions (${username}):`, error)
    return NextResponse.json(
      { error: `An unexpected error occurred while fetching contribution data: ${error.message}` },
      { status: 500 },
    )
  }
}
