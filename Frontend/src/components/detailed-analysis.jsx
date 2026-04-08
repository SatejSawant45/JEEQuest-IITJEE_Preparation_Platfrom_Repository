"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"

export function DetailedAnalysis({ attempts = [] }) {
  const completedAttempts = attempts.filter((a) => a.completedAt && a.quiz && a.percentage != null)

  // Process category performance using real quiz subject
  const processCategoryPerformance = () => {
    const categories = {}
    
    completedAttempts.forEach(attempt => {
      const category = attempt.quiz?.subject || 'General'
      const difficulty = attempt.quiz?.difficulty || 'Unspecified'
      
      if (!categories[category]) {
        categories[category] = { scores: [], count: 0, difficultyCount: {} }
      }
      
      categories[category].scores.push(attempt.percentage)
      categories[category].count += 1
      categories[category].difficultyCount[difficulty] = (categories[category].difficultyCount[difficulty] || 0) + 1
    })
    
    return Object.entries(categories).map(([category, data]) => ({
      category,
      averageScore: data.scores.length > 0 ? Math.round((data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length) * 10) / 10 : 0,
      attempts: data.count,
      difficulty: Object.entries(data.difficultyCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unspecified'
    })).filter(item => item.attempts > 0)
  }

  // Process retake analysis (group by quiz attempts)
  const processRetakeAnalysis = () => {
    const quizAttempts = {}
    
    completedAttempts.forEach(attempt => {
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
    
    completedAttempts.forEach(attempt => {
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
        category: attempts.find((a) => String(a.quiz?._id || a.quiz) === String(quizId))?.quiz?.subject || 'General'
      }))
      .filter(item => item.correctRate < 70) // Show only problem areas
      .sort((a, b) => a.correctRate - b.correctRate) // Sort by lowest score first
      .slice(0, 5) // Show top 5 problem areas
  }

  const generateInsights = () => {
    const insights = []
    const categoryData = processCategoryPerformance()

    if (categoryData.length > 0) {
      const bestCategory = [...categoryData].sort((a, b) => b.averageScore - a.averageScore)[0]
      insights.push({
        type: 'strong',
        title: 'Strong Performance',
        description: `${bestCategory.category} is your strongest subject with an average score of ${bestCategory.averageScore}%.`,
      })

      const weakestCategory = [...categoryData].sort((a, b) => a.averageScore - b.averageScore)[0]
      if (weakestCategory) {
        insights.push({
          type: 'improve',
          title: 'Area for Improvement',
          description: `${weakestCategory.category} needs focus. Current average is ${weakestCategory.averageScore}% across ${weakestCategory.attempts} attempts.`,
        })
      }
    }

    const timedAttempts = completedAttempts.filter((a) => a.startedAt && a.completedAt)
    if (timedAttempts.length > 0) {
      const averageDuration = timedAttempts.reduce((sum, a) => {
        const mins = (new Date(a.completedAt) - new Date(a.startedAt)) / (1000 * 60)
        return sum + mins
      }, 0) / timedAttempts.length

      const averageTarget = timedAttempts.reduce((sum, a) => sum + (a.quiz?.duration || 0), 0) / timedAttempts.length

      const ratio = averageTarget > 0 ? (averageDuration / averageTarget) : 1
      const timingMessage = ratio > 1
        ? `You are using about ${Math.round((ratio - 1) * 100)}% more time than quiz duration on average.`
        : `You are finishing about ${Math.round((1 - ratio) * 100)}% faster than the configured quiz duration.`

      insights.push({
        type: 'time',
        title: 'Time Management',
        description: timingMessage,
      })
    }

    return insights.slice(0, 3)
  }

  const categoryPerformanceData = processCategoryPerformance()
  const retakeAnalysisData = processRetakeAnalysis()
  const problemQuestions = processProblemQuestions()
  const insights = generateInsights()
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
                    {question.avgTime}m avg time
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
            {insights.map((insight, idx) => (
              <div key={`${insight.title}-${idx}`} className="space-y-2">
                <div className="flex items-center gap-2">
                  {insight.type === 'strong' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : insight.type === 'improve' ? (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="font-medium">{insight.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
