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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader2, Download, AlertTriangle, Github, BarChart3, Calendar, TrendingUp, Star, GitFork } from "lucide-react"

const BAR_SPACING = 1.1
const DAYS_IN_WEEK = 7

interface ContributionDay {
  contributionCount: number
  date: string
  weekday: number
}

function getContributionColor(count: number, maxContributions: number): string {
  if (count === 0) return "#2d333b"

  const normalizedMax = Math.min(maxContributions, 20)
  const percentage = normalizedMax > 0 ? count / normalizedMax : 0

  if (percentage <= 0.15) return "#39d353"
  if (percentage <= 0.35) return "#26a641"
  if (percentage <= 0.6) return "#006d32"
  return "#0e4429"
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
      castShadow
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
        <Html position={[0, height / 2 + 0.5, 0]} center distanceFactor={6}>
          <div className="bg-popover text-popover-foreground text-sm p-3 rounded-md shadow-lg whitespace-nowrap border">
            <span className="font-medium">{count} contributions</span>
            <br />
            <span className="text-muted-foreground">{new Date(date).toLocaleDateString()}</span>
          </div>
        </Html>
      )}
    </mesh>
  )
}

interface ContributionsData {
  contributions: ContributionDay[]
  totalContributions: number
  weeks: number
}

export default function Github3DContributions({ initialUsername = "ddoemonn" }: { initialUsername?: string }) {
  const [username, setUsername] = useState(initialUsername)
  const [inputUsername, setInputUsername] = useState(initialUsername)
  const [contributionsData, setContributionsData] = useState<ContributionsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const maxContributionsInDataSet = useMemo(() => {
    if (!contributionsData?.contributions) return 1
    return Math.max(...contributionsData.contributions.map((d) => d.contributionCount), 1)
  }, [contributionsData])

  const stats = useMemo(() => {
    if (!contributionsData?.contributions) return null
    
    const contributions = contributionsData.contributions
    const totalDays = contributions.length
    const activeDays = contributions.filter(d => d.contributionCount > 0).length
    const maxStreakDays = Math.max(...contributions.map(d => d.contributionCount))
    const avgDaily = contributionsData.totalContributions / totalDays
    
    return {
      totalDays,
      activeDays,
      maxStreakDays,
      avgDaily: Math.round(avgDaily * 100) / 100,
      streakPercentage: Math.round((activeDays / totalDays) * 100)
    }
  }, [contributionsData])

  const fetchContributions = useCallback(async (user: string) => {
    if (!user) {
      setError("Please enter a GitHub username.")
      return
    }
    setIsLoading(true)
    setError(null)
    setContributionsData(null)

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

  const numWeeks = contributionsData?.weeks || 52

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold">3D GitHub Contributions</h1>
            <Badge variant="secondary" className="text-xs">Interactive</Badge>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex flex-col p-4 gap-4 min-h-0">
        <Card className="flex-shrink-0">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <Input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="GitHub username"
                  className="w-40"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading} size="sm">
                  {isLoading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Github className="mr-1 h-3 w-3" />}
                  {isLoading ? "Loading..." : "Load"}
                </Button>
                <Button
                  type="button"
                  onClick={handleExport}
                  disabled={!contributionsData || isLoading}
                  variant="outline"
                  size="sm"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Export
                </Button>
              </form>

              {contributionsData && stats && (
                <div className="flex gap-4 text-base">
                  <div className="text-center">
                    <div className="font-bold text-primary text-lg">{contributionsData.totalContributions.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600 text-lg">{stats.activeDays}</div>
                    <div className="text-sm text-muted-foreground">Active Days</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-orange-600 text-lg">{stats.maxStreakDays}</div>
                    <div className="text-sm text-muted-foreground">Max Daily</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600 text-lg">{stats.streakPercentage}%</div>
                    <div className="text-sm text-muted-foreground">Active Rate</div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mt-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-sm">Error</AlertTitle>
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="flex-shrink-0 overflow-hidden">
          <div className="relative h-[85vh] w-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                <div className="text-center space-y-4">
                  <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Loading contribution data...</p>
                    <p className="text-muted-foreground">This might take a moment</p>
                  </div>
                </div>
              </div>
            )}
            
            {!isLoading && !error && !contributionsData && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Calendar className="h-20 w-20 text-muted-foreground/50 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-muted-foreground">Ready to Explore</h3>
                    <p className="text-muted-foreground max-w-md">
                      Enter a GitHub username above to create a stunning 3D visualization of their contribution history.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {contributionsData && contributionsData.contributions.length > 0 && (
              <Canvas
                ref={canvasRef}
                camera={{ position: [0, numWeeks * 0.5, numWeeks * 0.7], fov: 45 }}
                gl={{ preserveDrawingBuffer: true }}
                shadows
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
                <Environment preset="sunset" />
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={5}
                  maxDistance={numWeeks * 2}
                />
                <group>
                  {contributionsData.contributions.map((day, index) => {
                    const weekIndex = Math.floor(index / DAYS_IN_WEEK)
                    const dayIndex = index % DAYS_IN_WEEK

                    const xPos = (dayIndex - 3) * BAR_SPACING
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
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                  <planeGeometry args={[DAYS_IN_WEEK * BAR_SPACING * 1.5, numWeeks * BAR_SPACING * 1.2]} />
                  <shadowMaterial opacity={0.3} />
                </mesh>
                <Html position={[0, numWeeks * 0.35, 0]} center distanceFactor={numWeeks * 0.15}>
                  <div className="text-foreground bg-background/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border-2 pointer-events-none select-none max-w-lg">
                    <div className="text-center space-y-4">
                      <h2 className="text-4xl font-bold flex items-center gap-4 justify-center">
                        <Github className="h-8 w-8" />
                        {username}'s Contributions
                      </h2>
                      <div className="flex items-center gap-8 text-xl justify-center flex-wrap">
                        <span className="flex items-center gap-3">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                          <span className="font-bold text-2xl">{contributionsData.totalContributions.toLocaleString()}</span> 
                          <span className="font-semibold">total</span>
                        </span>
                        <span className="flex items-center gap-3">
                          <Calendar className="h-6 w-6 text-blue-600" />
                          <span className="font-bold text-2xl">{stats?.activeDays}</span> 
                          <span className="font-semibold">active days</span>
                        </span>
                      </div>
                      <p className="text-lg text-muted-foreground font-medium">Scroll to zoom • Drag to orbit • Hover for details</p>
                    </div>
                  </div>
                </Html>
              </Canvas>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
