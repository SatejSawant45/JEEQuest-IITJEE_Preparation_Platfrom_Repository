
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewCharts } from "@/components/overview-charts"
import { PerformanceCharts } from "@/components/performance-charts"
import { DetailedAnalysis } from "@/components/detailed-analysis"
import { TrendingUp, TrendingDown, Users, Clock, Target, Award } from "lucide-react"

export default function QuizAnalysisPage() {
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [overallStats, setOverallStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    completionRate: 0,
    averageTime: 0,
    topScore: 0,
    passRate: 0,
  })

  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL

  // Load user attempts data
  const loadAttempts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("jwtToken")
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${primaryBackendUrl}/api/attempt/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch attempts')
      }

      const attemptsData = await response.json()
      console.log('Fetched attempts:', attemptsData)
      
      setAttempts(attemptsData)
      calculateStats(attemptsData)
    } catch (err) {
      console.error('Error loading attempts:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics from attempts data
  const calculateStats = (attemptsData) => {
    if (!attemptsData || attemptsData.length === 0) {
      return
    }

    const completedAttempts = attemptsData.filter(attempt => attempt.completedAt)
    const totalAttempts = attemptsData.length
    const completedCount = completedAttempts.length
    
    // Calculate average score
    const totalScore = completedAttempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0)
    const averageScore = completedCount > 0 ? (totalScore / completedCount) : 0
    
    // Calculate completion rate
    const completionRate = totalAttempts > 0 ? (completedCount / totalAttempts) * 100 : 0
    
    // Calculate average time (assuming duration is stored or calculated)
    const attemptsWithTime = completedAttempts.filter(attempt => attempt.completedAt && attempt.startedAt)
    const totalTime = attemptsWithTime.reduce((sum, attempt) => {
      const duration = new Date(attempt.completedAt) - new Date(attempt.startedAt)
      return sum + (duration / (1000 * 60)) // Convert to minutes
    }, 0)
    const averageTime = attemptsWithTime.length > 0 ? (totalTime / attemptsWithTime.length) : 0
    
    // Find top score
    const topScore = completedAttempts.length > 0 ? Math.max(...completedAttempts.map(a => a.percentage || 0)) : 0
    
    // Calculate pass rate (assuming 60% is passing)
    const passThreshold = 60
    const passedAttempts = completedAttempts.filter(attempt => (attempt.percentage || 0) >= passThreshold)
    const passRate = completedCount > 0 ? (passedAttempts.length / completedCount) * 100 : 0

    setOverallStats({
      totalAttempts,
      averageScore: Math.round(averageScore * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
      averageTime: Math.round(averageTime * 10) / 10,
      topScore: Math.round(topScore),
      passRate: Math.round(passRate * 10) / 10,
    })
  }

  useEffect(() => {
    loadAttempts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="ml-4 text-lg">Loading analytics...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading analytics: {error}</p>
              <button 
                onClick={loadAttempts}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (attempts.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Quiz Analysis Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive analysis of quiz attempts and performance metrics</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Quiz Attempts Yet</h3>
              <p className="text-muted-foreground mb-4">Take some quizzes to see your performance analytics</p>
              <button 
                onClick={() => window.location.href = '/user/dashboard/quizzes'}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Browse Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Quiz Analysis Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of your {overallStats.totalAttempts} quiz attempts and performance metrics
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalAttempts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3" /> +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3" /> +2.3% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3" /> -1.2% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.averageTime}m</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3" /> -0.8m from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.topScore}%</div>
              <p className="text-xs text-muted-foreground">Perfect score achieved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.passRate}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3" /> +3.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewCharts attempts={attempts} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <PerformanceCharts attempts={attempts} />
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            <DetailedAnalysis attempts={attempts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
