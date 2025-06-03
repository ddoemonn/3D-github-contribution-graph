"use client"

import { useMemo } from "react"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Download, AlertTriangle } from "lucide-react"

const BAR_SPACING = 1.1 // Increased spacing slightly
const DAYS_IN_WEEK = 7

interface ContributionDay {
  contributionCount: number
  date: string // YYYY-MM-DD
  weekday: number // 0 (Sun) to 6 (Sat)
}

// Updated color logic
function getContributionColor(count: number, maxContributions: number): string {
  if (count === 0) return "#2d333b" // Empty

  // Normalize count for better color distribution if maxContributions is very high
  const normalizedMax = Math.min(maxContributions, 20) // Cap at 20 for color scaling
  const percentage = normalizedMax > 0 ? count / normalizedMax : 0

  if (percentage <= 0.15) return "#39d353" // Bright green (1-3 if max is 20)
  if (percentage <= 0.35) return "#26a641" // Medium green (4-7 if max is 20)
  if (percentage <= 0.6) return "#006d32" // Darker green (8-12 if max is 20)
  return "#0e4429" // Deepest green (13+ if max is 20, or "too much")
}

interface ContributionBarProps {
  position: [number, number, number]
  count: number
  date: string
  maxContributionsInDataSet: number
}

function ContributionBar({ position, count, date, maxContributionsInDataSet }: ContributionBarProps) {
  const height = count > 0 ? 0.2 + (count / Math.max(1, maxContributionsInDataSet)) * 4 : 0.1
  const color = getContributionColor(count, maxContributionsInDataSet)
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={[position[0], height / 2, position[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow // Bars should cast shadows
    >
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial
        color={color}
        roughness={0.6}
        metalness={0.2}
        emissive={hovered ? color : "#000000"}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
      {hovered && (
        <Html position={[0, height / 2 + 0.5, 0]} center distanceFactor={8}>
          <div className="bg-neutral-800 text-white text-xs p-1.5 rounded shadow-lg whitespace-nowrap">
            {count} contributions on {new Date(date).toLocaleDateString()}
          </div>
        </Html>
      )}
    </mesh>
  )
}

interface ContributionsData {
  contributions: ContributionDay[]
  totalContributions: number
  weeks: number // Number of weeks in the data
}

export default function Github3DContributions({ initialUsername = "ddoemonn" }: { initialUsername?: string }) {
  const [username, setUsername] = useState(initialUsername)
  const [inputUsername, setInputUsername] = useState(initialUsername)
  const [contributionsData, setContributionsData] = useState<ContributionsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null) // For export

  const maxContributionsInDataSet = useMemo(() => {
    if (!contributionsData?.contributions) return 1 // Default to 1 to avoid division by zero
    return Math.max(...contributionsData.contributions.map((d) => d.contributionCount), 1)
  }, [contributionsData])

  const fetchContributions = useCallback(async (user: string) => {
    if (!user) {
      setError("Please enter a GitHub username.")
      return
    }
    setIsLoading(true)
    setError(null)
    setContributionsData(null) // Clear previous data

    try {
      const response = await fetch(`/api/github-contributions?username=${encodeURIComponent(user)}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to fetch data: ${response.statusText}`)
      }
      const data: ContributionsData = await response.json()
      if (!data.contributions || data.contributions.length === 0) {
        setError(
          `No contribution data found for ${user}. The user might not exist or has no public contributions in the last year.`,
        )
        setContributionsData(null)
      } else {
        setContributionsData(data)
      }
    } catch (err: any) {
      console.error("Fetch error:", err)
      setError(err.message || "An unexpected error occurred.")
      setContributionsData(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (username) {
      fetchContributions(username)
    }
  }, [username, fetchContributions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUsername(inputUsername.trim())
  }

  const handleExport = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `${username}_contributions_3d.png`
      link.href = image
      link.click()
    }
  }

  // Calculate number of weeks based on fetched data, default to 52 if not available
  const numWeeks = contributionsData?.weeks || 52

  return (
    <div className="w-full h-screen flex flex-col bg-neutral-900 text-neutral-100">
      <Card className="m-4 bg-neutral-800 border-neutral-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-green-400">3D GitHub Contribution Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4 items-center justify-center">
            <Input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder="Enter GitHub Username"
              className="max-w-xs bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-400"
            />
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Load Contributions
            </Button>
            <Button
              type="button"
              onClick={handleExport}
              disabled={!contributionsData || isLoading}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-neutral-900"
            >
              <Download className="mr-2 h-4 w-4" /> Export PNG
            </Button>
          </form>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/50 border-red-700 text-red-300">
              <AlertTriangle className="h-4 w-4 !text-red-300" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex-grow relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80 z-10">
            <Loader2 className="h-16 w-16 animate-spin text-green-400" />
          </div>
        )}
        {!isLoading && !error && !contributionsData && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* MODIFIED PART: Replaced R3F Text with HTML p tag */}
            <p className="text-neutral-500 text-xl text-center p-4">
              Enter a GitHub username above to load the contribution graph.
            </p>
          </div>
        )}
        {contributionsData && contributionsData.contributions.length > 0 && (
          <Canvas
            ref={canvasRef}
            camera={{ position: [numWeeks * 0.3, numWeeks * 0.4, numWeeks * 0.6], fov: 50 }} // Adjust camera based on numWeeks
            gl={{ preserveDrawingBuffer: true }} // Important for export
            shadows // Enable shadows
            className="w-full h-full"
          >
            <ambientLight intensity={1} />
            <directionalLight
              position={[20, 30, 20]}
              intensity={2.5}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <Environment preset="sunset" /> {/* Changed preset for a different mood */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={numWeeks * 2} // Adjust max distance
            />
            <group>
              {contributionsData.contributions.map((day, index) => {
                // The GitHub API returns days sequentially, already ordered by week.
                // We need to map this flat list to a 2D grid.
                const weekIndex = Math.floor(index / DAYS_IN_WEEK)
                const dayIndex = index % DAYS_IN_WEEK // This is day of week (0-6)

                // Center the grid:
                // X-axis: day of the week (e.g., Sunday to Saturday)
                // Z-axis: week of the year
                const xPos = (dayIndex - (DAYS_IN_WEEK - 1) / 2) * BAR_SPACING
                const zPos = (weekIndex - (numWeeks - 1) / 2) * BAR_SPACING

                return (
                  <ContributionBar
                    key={day.date}
                    position={[xPos, 0, zPos]}
                    count={day.contributionCount}
                    date={day.date}
                    maxContributionsInDataSet={maxContributionsInDataSet}
                  />
                )
              })}
            </group>
            {/* Ground plane to receive shadows */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
              <planeGeometry args={[numWeeks * BAR_SPACING * 1.2, DAYS_IN_WEEK * BAR_SPACING * 1.2]} />
              <shadowMaterial opacity={0.3} />
            </mesh>
            <Html position={[0, numWeeks * 0.2, 0]} center distanceFactor={numWeeks * 0.5}>
              <div className="text-neutral-200 bg-neutral-900/80 p-3 rounded-lg shadow-xl select-none text-center pointer-events-none">
                <h2 className="text-xl font-bold">{username}'s Contributions</h2>
                <p className="text-sm">{contributionsData.totalContributions.toLocaleString()} total contributions</p>
                <p className="text-xs mt-1 text-neutral-400">Scroll to zoom, drag to orbit</p>
              </div>
            </Html>
          </Canvas>
        )}
      </div>
    </div>
  )
}
