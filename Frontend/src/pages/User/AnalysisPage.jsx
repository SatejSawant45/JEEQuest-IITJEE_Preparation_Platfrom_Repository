

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewCharts } from "@/components/overview-charts"
import { PerformanceCharts } from "@/components/performance-charts"
import { DetailedAnalysis } from "@/components/detailed-analysis"
import { TrendingUp, TrendingDown, Users, Clock, Target, Award } from "lucide-react"

export default function QuizAnalysisPage() {
  const overallStats = {
    totalAttempts: 1247,
    averageScore: 78.5,
    completionRate: 92.3,
    averageTime: 12.4,
    topScore: 98,
    passRate: 85.2,
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Quiz Analysis Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive analysis of quiz attempts and performance metrics</p>
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
            <OverviewCharts />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <PerformanceCharts />
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            <DetailedAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
