"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"

const categoryPerformanceData = [
  { category: "Mathematics", averageScore: 82.4, attempts: 234, difficulty: "Medium" },
  { category: "Science", averageScore: 76.8, attempts: 189, difficulty: "Hard" },
  { category: "History", averageScore: 88.2, attempts: 156, difficulty: "Easy" },
  { category: "Literature", averageScore: 71.5, attempts: 203, difficulty: "Hard" },
  { category: "Geography", averageScore: 79.3, attempts: 178, difficulty: "Medium" },
]

const retakeAnalysisData = [
  { attempt: "1st", score: 65.2, count: 1247 },
  { attempt: "2nd", score: 73.8, count: 456 },
  { attempt: "3rd", score: 79.1, count: 189 },
  { attempt: "4th", score: 82.5, count: 67 },
  { attempt: "5th+", score: 85.2, count: 23 },
]

const problemQuestions = [
  { question: "Q7", correctRate: 39, avgTime: 142, category: "Science" },
  { question: "Q5", correctRate: 45, avgTime: 125, category: "Mathematics" },
  { question: "Q9", correctRate: 56, avgTime: 156, category: "Literature" },
]

export function DetailedAnalysis() {
  return (
    <div className="space-y-6">
      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
          <CardDescription>Detailed breakdown of performance across different subject categories</CardDescription>
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
            <BarChart data={categoryPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name, props) => [
                  name === "averageScore" ? `${value}%` : value,
                  name === "averageScore" ? "Average Score" : "Attempts",
                  <Badge key="difficulty" variant="outline" className="ml-2">
                    {props.payload?.difficulty}
                  </Badge>,
                ]}
              />
              <Bar yAxisId="left" dataKey="averageScore" fill="var(--color-averageScore)" radius={4} />
              <Bar yAxisId="right" dataKey="attempts" fill="var(--color-attempts)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Retake Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Retake Analysis</CardTitle>
            <CardDescription>Performance improvement across multiple attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: {
                  label: "Average Score (%)",
                  color: "hsl(var(--chart-3))",
                },
                count: {
                  label: "Number of Students",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[250px]"
            >
              <AreaChart data={retakeAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attempt" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-score)"
                  fill="var(--color-score)"
                  fillOpacity={0.6}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  fill="var(--color-count)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Problem Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Problem Questions</CardTitle>
            <CardDescription>Questions requiring attention based on performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {problemQuestions.map((question) => (
              <div key={question.question} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{question.question}</span>
                    <Badge variant="outline">{question.category}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{question.correctRate}% correct</span>
                </div>
                <Progress value={question.correctRate} className="h-2" />
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {question.avgTime}s avg time
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Needs review
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
          <CardDescription>Actionable insights based on the analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Strong Performance</span>
              </div>
              <p className="text-sm text-muted-foreground">
                History and Mathematics categories show consistently high scores above 80%
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Areas for Improvement</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Science and Literature questions need content review and clearer explanations
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Time Management</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Students are taking 15% longer than optimal time on difficult questions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
