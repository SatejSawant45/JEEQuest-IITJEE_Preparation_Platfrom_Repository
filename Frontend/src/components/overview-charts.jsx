"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Area, AreaChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts"

export function OverviewCharts({ attempts = [] }) {
  // Transform attempts data for charts
  const processAttemptTrends = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthlyData = {}
    
    attempts.forEach(attempt => {
      const date = new Date(attempt.createdAt || attempt.startedAt)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      const monthName = monthNames[date.getMonth()]
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { date: monthName, attempts: 0, completed: 0 }
      }
      
      monthlyData[monthKey].attempts += 1
      if (attempt.completedAt) {
        monthlyData[monthKey].completed += 1
      }
    })
    
    return Object.values(monthlyData).slice(-6) // Last 6 months
  }

  const processScoreDistribution = () => {
    const ranges = [
      { range: "0-20%", min: 0, max: 20, count: 0, fill: "hsl(var(--chart-1))" },
      { range: "21-40%", min: 21, max: 40, count: 0, fill: "hsl(var(--chart-2))" },
      { range: "41-60%", min: 41, max: 60, count: 0, fill: "hsl(var(--chart-3))" },
      { range: "61-80%", min: 61, max: 80, count: 0, fill: "hsl(var(--chart-4))" },
      { range: "81-100%", min: 81, max: 100, count: 0, fill: "hsl(var(--chart-5))" },
    ]
    
    attempts.filter(a => a.completedAt && a.percentage != null).forEach(attempt => {
      ranges.forEach(range => {
        if (attempt.percentage >= range.min && attempt.percentage <= range.max) {
          range.count += 1
        }
      })
    })
    
    return ranges
  }

  const processDifficultyPerformance = () => {
    // For now, we'll categorize based on quiz titles or use generic categories
    // This could be enhanced if quiz difficulty is stored in the database
    const categories = {
      "Easy": { totalScore: 0, count: 0 },
      "Medium": { totalScore: 0, count: 0 },
      "Hard": { totalScore: 0, count: 0 }
    }
    
    attempts.filter(a => a.completedAt && a.percentage != null).forEach(attempt => {
      // Simple categorization based on average score
      if (attempt.percentage >= 80) {
        categories.Easy.totalScore += attempt.percentage
        categories.Easy.count += 1
      } else if (attempt.percentage >= 60) {
        categories.Medium.totalScore += attempt.percentage
        categories.Medium.count += 1
      } else {
        categories.Hard.totalScore += attempt.percentage
        categories.Hard.count += 1
      }
    })
    
    return Object.entries(categories).map(([difficulty, data]) => ({
      difficulty,
      averageScore: data.count > 0 ? Math.round((data.totalScore / data.count) * 10) / 10 : 0,
      attempts: data.count
    })).filter(item => item.attempts > 0)
  }

  const attemptTrendsData = processAttemptTrends()
  const scoreDistributionData = processScoreDistribution()
  const difficultyPerformanceData = processDifficultyPerformance()
  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {/* Attempt Trends */}
      <Card className="lg:col-span-2 xl:col-span-2">
        <CardHeader>
          <CardTitle>Quiz Attempt Trends</CardTitle>
          <CardDescription>Monthly quiz attempts and completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              attempts: {
                label: "Total Attempts",
                color: "hsl(var(--chart-1))",
              },
              completed: {
                label: "Completed",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <AreaChart data={attemptTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="attempts"
                stackId="1"
                stroke="var(--color-attempts)"
                fill="var(--color-attempts)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="2"
                stroke="var(--color-completed)"
                fill="var(--color-completed)"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Score Distribution */}
      <Card className="lg:col-span-1 xl:col-span-1">
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>Distribution of quiz scores across all attempts</CardDescription>
        </CardHeader>
        <CardContent>
          {scoreDistributionData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <div className="text-center">
                <div className="text-sm">No completed quiz attempts yet</div>
                <div className="text-xs mt-1">Complete some quizzes to see score distribution</div>
              </div>
            </div>
          ) : (
            <>
              <ChartContainer
                config={{
                  count: {
                    label: "Attempts",
                  },
                }}
                className="h-[250px]"
              >
            <PieChart>
              <Pie
                data={scoreDistributionData}
                dataKey="count"
                nameKey="range"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={30}
                paddingAngle={2}
                label={({ range, percent }) => 
                  percent > 0.05 ? `${range}` : '' // Only show label if slice is > 5%
                }
                labelLine={false}
              >
                {scoreDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  `${value} attempts`, 
                  name
                ]}
              />
            </PieChart>
          </ChartContainer>
          <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
            {scoreDistributionData.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-muted-foreground">{item.range}</span>
              </div>
            ))}
          </div>
          </>
          )}
        </CardContent>
      </Card>

      {/* Difficulty Performance */}
      <Card className="md:col-span-1 lg:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle>Performance by Difficulty Level</CardTitle>
          <CardDescription>Average scores and attempt counts across difficulty levels</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              averageScore: {
                label: "Average Score (%)",
                color: "hsl(var(--chart-1))",
              },
              attempts: {
                label: "Total Attempts",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <BarChart data={difficultyPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="difficulty" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="left" dataKey="averageScore" fill="var(--color-averageScore)" radius={4} />
              <Bar yAxisId="right" dataKey="attempts" fill="var(--color-attempts)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
