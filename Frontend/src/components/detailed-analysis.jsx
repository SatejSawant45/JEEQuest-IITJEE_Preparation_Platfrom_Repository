"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"

export function DetailedAnalysis({ attempts = [] }) {
  // Process category performance (categorize by quiz titles)
  const processCategoryPerformance = () => {
    const categories = {}
    
    attempts.filter(a => a.completedAt && a.quiz && a.percentage != null).forEach(attempt => {
      const quizTitle = attempt.quiz.title || 'Unknown'
      let category = 'General'
      
      // Simple categorization based on quiz title keywords
      if (quizTitle.toLowerCase().includes('math') || quizTitle.toLowerCase().includes('algebra') || quizTitle.toLowerCase().includes('calculus')) {
        category = 'Mathematics'
      } else if (quizTitle.toLowerCase().includes('science') || quizTitle.toLowerCase().includes('physics') || quizTitle.toLowerCase().includes('chemistry')) {
        category = 'Science'
      } else if (quizTitle.toLowerCase().includes('history')) {
        category = 'History'
      } else if (quizTitle.toLowerCase().includes('literature') || quizTitle.toLowerCase().includes('english')) {
        category = 'Literature'
      } else if (quizTitle.toLowerCase().includes('geography')) {
        category = 'Geography'
      }
      
      if (!categories[category]) {
        categories[category] = { scores: [], count: 0 }
      }
      
      categories[category].scores.push(attempt.percentage)
      categories[category].count += 1
    })
    
    return Object.entries(categories).map(([category, data]) => ({
      category,
      averageScore: data.scores.length > 0 ? Math.round((data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length) * 10) / 10 : 0,
      attempts: data.count,
      difficulty: data.averageScore >= 80 ? "Easy" : data.averageScore >= 60 ? "Medium" : "Hard"
    })).filter(item => item.attempts > 0)
  }

  // Process retake analysis (group by quiz attempts)
  const processRetakeAnalysis = () => {
    const quizAttempts = {}
    
    attempts.filter(a => a.completedAt && a.quiz && a.percentage != null).forEach(attempt => {
      const quizId = attempt.quiz._id || attempt.quiz
      
      if (!quizAttempts[quizId]) {
        quizAttempts[quizId] = []
      }
      
      quizAttempts[quizId].push({
        score: attempt.percentage,
        date: new Date(attempt.completedAt)
      })
    })
    
    // Sort attempts by date for each quiz
    Object.keys(quizAttempts).forEach(quizId => {
      quizAttempts[quizId].sort((a, b) => a.date - b.date)
    })
    
    const retakeData = { "1st": [], "2nd": [], "3rd": [], "4th": [], "5th+": [] }
    
    Object.values(quizAttempts).forEach(attemptList => {
      attemptList.forEach((attempt, index) => {
        let attemptKey = `${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'}`
        if (index >= 4) attemptKey = "5th+"
        
        if (retakeData[attemptKey]) {
          retakeData[attemptKey].push(attempt.score)
        }
      })
    })
    
    return Object.entries(retakeData).map(([attempt, scores]) => ({
      attempt,
      score: scores.length > 0 ? Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10 : 0,
      count: scores.length
    })).filter(item => item.count > 0)
  }

  // Find problem areas (low scoring quizzes)
  const processProblemQuestions = () => {
    const quizPerformance = {}
    
    attempts.filter(a => a.completedAt && a.quiz && a.percentage != null).forEach(attempt => {
      const quizId = attempt.quiz._id || attempt.quiz
      const quizTitle = attempt.quiz.title || `Quiz ${quizId.slice(-4)}`
      
      if (!quizPerformance[quizId]) {
        quizPerformance[quizId] = {
          title: quizTitle,
          scores: [],
          times: []
        }
      }
      
      quizPerformance[quizId].scores.push(attempt.percentage)
      
      if (attempt.startedAt && attempt.completedAt) {
        const duration = (new Date(attempt.completedAt) - new Date(attempt.startedAt)) / (1000 * 60)
        quizPerformance[quizId].times.push(duration)
      }
    })
    
    return Object.entries(quizPerformance)
      .map(([quizId, data]) => ({
        question: data.title.length > 20 ? `${data.title.slice(0, 20)}...` : data.title,
        correctRate: Math.round((data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length) * 10) / 10,
        avgTime: data.times.length > 0 ? Math.round((data.times.reduce((sum, time) => sum + time, 0) / data.times.length) * 10) / 10 : 0,
        category: 'General'
      }))
      .filter(item => item.correctRate < 70) // Show only problem areas
      .sort((a, b) => a.correctRate - b.correctRate) // Sort by lowest score first
      .slice(0, 5) // Show top 5 problem areas
  }

  const categoryPerformanceData = processCategoryPerformance()
  const retakeAnalysisData = processRetakeAnalysis()
  const problemQuestions = processProblemQuestions()
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
