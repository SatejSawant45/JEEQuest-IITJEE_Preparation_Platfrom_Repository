"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Badge } from "@/components/ui/badge"

export function PerformanceCharts({ attempts = [] }) {
  // Process quiz performance data
  const processQuizPerformance = () => {
    const quizData = {}
    
    attempts.filter(a => a.completedAt && a.quiz).forEach(attempt => {
      const quizId = attempt.quiz._id || attempt.quiz
      const quizTitle = attempt.quiz.title || `Quiz ${quizId.slice(-4)}`
      
      if (!quizData[quizId]) {
        quizData[quizId] = {
          title: quizTitle,
          scores: [],
          times: []
        }
      }
      
      if (attempt.percentage != null) {
        quizData[quizId].scores.push(attempt.percentage)
      }
      
      if (attempt.startedAt && attempt.completedAt) {
        const duration = (new Date(attempt.completedAt) - new Date(attempt.startedAt)) / (1000 * 60)
        quizData[quizId].times.push(duration)
      }
    })
    
    return Object.entries(quizData).map(([quizId, data]) => ({
      quiz: data.title,
      averageScore: data.scores.length > 0 ? Math.round((data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length) * 10) / 10 : 0,
      attempts: data.scores.length,
      avgTime: data.times.length > 0 ? Math.round((data.times.reduce((sum, time) => sum + time, 0) / data.times.length) * 10) / 10 : 0,
      difficulty: data.averageScore >= 80 ? "Easy" : data.averageScore >= 60 ? "Medium" : "Hard"
    })).slice(0, 10) // Show top 10 quizzes
  }

  const processTimeAnalysis = () => {
    const completedAttempts = attempts.filter(a => a.completedAt && a.startedAt)
    
    return completedAttempts.slice(0, 10).map((attempt, index) => {
      const duration = (new Date(attempt.completedAt) - new Date(attempt.startedAt)) / (1000 * 60)
      const quizTitle = attempt.quiz?.title || `Quiz ${index + 1}`
      
      return {
        question: quizTitle.length > 15 ? `${quizTitle.slice(0, 15)}...` : quizTitle,
        avgTime: Math.round(duration * 10) / 10,
        optimalTime: Math.round(duration * 1.2 * 10) / 10, // Estimate optimal as 20% more
        score: attempt.percentage || 0
      }
    })
  }

  const questionPerformanceData = processQuizPerformance()
  const timeAnalysisData = processTimeAnalysis()
  
  const processPerformanceTrend = () => {
    const weeklyData = {}
    const now = new Date()
    
    // Group attempts by week (last 6 weeks)
    attempts.filter(a => a.completedAt && a.percentage != null).forEach(attempt => {
      const attemptDate = new Date(attempt.completedAt)
      const weeksDiff = Math.floor((now - attemptDate) / (7 * 24 * 60 * 60 * 1000))
      
      if (weeksDiff >= 0 && weeksDiff < 6) {
        const weekKey = `Week ${6 - weeksDiff}`
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = { scores: [], count: 0 }
        }
        
        weeklyData[weekKey].scores.push(attempt.percentage)
        weeklyData[weekKey].count += 1
      }
    })
    
    return Array.from({ length: 6 }, (_, i) => {
      const weekKey = `Week ${i + 1}`
      const data = weeklyData[weekKey] || { scores: [], count: 0 }
      
      return {
        week: weekKey,
        averageScore: data.scores.length > 0 ? Math.round((data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length) * 10) / 10 : 0,
        attempts: data.count
      }
    })
  }
  
  const performanceTrendData = processPerformanceTrend()
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
