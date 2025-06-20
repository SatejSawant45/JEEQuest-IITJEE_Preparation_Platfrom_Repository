"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Area, AreaChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts"

const attemptTrendsData = [
  { date: "Jan", attempts: 186, completed: 165 },
  { date: "Feb", attempts: 305, completed: 280 },
  { date: "Mar", attempts: 237, completed: 220 },
  { date: "Apr", attempts: 273, completed: 250 },
  { date: "May", attempts: 209, completed: 195 },
  { date: "Jun", attempts: 314, completed: 290 },
]

const scoreDistributionData = [
  { range: "0-20%", count: 45, fill: "hsl(var(--chart-1))" },
  { range: "21-40%", count: 89, fill: "hsl(var(--chart-2))" },
  { range: "41-60%", count: 156, fill: "hsl(var(--chart-3))" },
  { range: "61-80%", count: 234, fill: "hsl(var(--chart-4))" },
  { range: "81-100%", count: 178, fill: "hsl(var(--chart-5))" },
]

const difficultyPerformanceData = [
  { difficulty: "Easy", averageScore: 89.2, attempts: 450 },
  { difficulty: "Medium", averageScore: 76.8, attempts: 520 },
  { difficulty: "Hard", averageScore: 62.4, attempts: 277 },
]

export function OverviewCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Attempt Trends */}
      <Card className="col-span-2">
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
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>Distribution of quiz scores across all attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Count",
              },
            }}
            className="h-[300px]"
          >
            <PieChart>
              <Pie
                data={scoreDistributionData}
                dataKey="count"
                nameKey="range"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
              >
                {scoreDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Difficulty Performance */}
      <Card className="col-span-3">
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
