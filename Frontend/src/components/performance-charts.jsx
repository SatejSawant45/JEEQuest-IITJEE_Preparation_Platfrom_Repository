"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Badge } from "@/components/ui/badge"

const questionPerformanceData = [
  { question: "Q1", correctRate: 92, difficulty: "Easy" },
  { question: "Q2", correctRate: 87, difficulty: "Easy" },
  { question: "Q3", correctRate: 74, difficulty: "Medium" },
  { question: "Q4", correctRate: 68, difficulty: "Medium" },
  { question: "Q5", correctRate: 45, difficulty: "Hard" },
  { question: "Q6", correctRate: 82, difficulty: "Medium" },
  { question: "Q7", correctRate: 39, difficulty: "Hard" },
  { question: "Q8", correctRate: 91, difficulty: "Easy" },
  { question: "Q9", correctRate: 56, difficulty: "Hard" },
  { question: "Q10", correctRate: 78, difficulty: "Medium" },
]

const timeAnalysisData = [
  { question: "Q1", avgTime: 45, optimalTime: 60 },
  { question: "Q2", avgTime: 52, optimalTime: 60 },
  { question: "Q3", avgTime: 78, optimalTime: 90 },
  { question: "Q4", avgTime: 95, optimalTime: 90 },
  { question: "Q5", avgTime: 125, optimalTime: 120 },
  { question: "Q6", avgTime: 67, optimalTime: 75 },
  { question: "Q7", avgTime: 142, optimalTime: 120 },
  { question: "Q8", avgTime: 38, optimalTime: 45 },
  { question: "Q9", avgTime: 156, optimalTime: 150 },
  { question: "Q10", avgTime: 89, optimalTime: 90 },
]

const performanceTrendData = [
  { week: "Week 1", averageScore: 72.5, attempts: 89 },
  { week: "Week 2", averageScore: 75.2, attempts: 94 },
  { week: "Week 3", averageScore: 78.1, attempts: 102 },
  { week: "Week 4", averageScore: 76.8, attempts: 87 },
  { week: "Week 5", averageScore: 79.3, attempts: 95 },
  { week: "Week 6", averageScore: 81.2, attempts: 108 },
]

export function PerformanceCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Question Performance */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Question-wise Performance Analysis</CardTitle>
          <CardDescription>Correct answer rates for each question</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              correctRate: {
                label: "Correct Rate (%)",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <BarChart data={questionPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name, props) => [
                  `${value}%`,
                  "Correct Rate",
                  <Badge key="difficulty" variant="outline" className="ml-2">
                    {props.payload?.difficulty}
                  </Badge>,
                ]}
              />
              <Bar dataKey="correctRate" fill="var(--color-correctRate)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Time Analysis</CardTitle>
          <CardDescription>Average time spent vs optimal time per question</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              avgTime: {
                label: "Average Time (s)",
                color: "hsl(var(--chart-2))",
              },
              optimalTime: {
                label: "Optimal Time (s)",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <LineChart data={timeAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="avgTime" stroke="var(--color-avgTime)" strokeWidth={2} dot={{ r: 4 }} />
              <Line
                type="monotone"
                dataKey="optimalTime"
                stroke="var(--color-optimalTime)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance Trends</CardTitle>
          <CardDescription>Average scores and attempt volumes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              averageScore: {
                label: "Average Score (%)",
                color: "hsl(var(--chart-4))",
              },
              attempts: {
                label: "Attempts",
                color: "hsl(var(--chart-5))",
              },
            }}
            className="h-[300px]"
          >
            <LineChart data={performanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="averageScore"
                stroke="var(--color-averageScore)"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="attempts"
                stroke="var(--color-attempts)"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
