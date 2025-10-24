import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, TrendingUp, Home, RotateCcw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { saveQuizAttempt, getPerformanceLevel } from '@/lib/quizHistory'

export default function QuizResults() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get results data passed from the quiz component
  const { 
    quizData, 
    userAnswers, 
    score, 
    percentage, 
    timeTaken,
    totalTime,
    fromBackend 
  } = location.state || {}

  // Redirect if no data is available
  if (!quizData || !userAnswers) {
    navigate('/dashboard')
    return null
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const scoreLevel = getPerformanceLevel(percentage)

  // Save quiz attempt to history when component mounts (only for fallback cases)
  useEffect(() => {
    // Only save to localStorage if data didn't come from backend (fallback scenario)
    if (!fromBackend && quizData && percentage !== undefined && score !== undefined) {
      const attemptData = {
        quizId: quizData.id || quizData._id || 'unknown',
        quizTitle: quizData.title,
        score,
        totalQuestions: quizData.questions.length,
        percentage,
        timeTaken,
        totalTime,
        performanceLevel: scoreLevel.level
      };

      const saved = saveQuizAttempt(attemptData);
      if (saved) {
        console.log('Quiz attempt saved to localStorage (fallback)');
      } else {
        console.error('Failed to save quiz attempt to localStorage');
      }
    } else if (fromBackend) {
      console.log('Quiz attempt already saved to backend database');
    }
  }, [quizData, score, percentage, timeTaken, totalTime, scoreLevel.level, fromBackend])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6 border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Badge className={`${scoreLevel.bgColor} ${scoreLevel.color} border-0`}>
                    {scoreLevel.level}
                  </Badge>
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              Quiz Completed!
            </CardTitle>
            <p className="text-gray-600 text-lg">{quizData.title}</p>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {percentage.toFixed(1)}%
                </div>
                <p className="text-gray-600">Percentage Score</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {score}/{quizData.questions.length}
                </div>
                <p className="text-gray-600">Questions Correct</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-2">
                  <Clock className="w-6 h-6" />
                  {formatTime(timeTaken)}
                </div>
                <p className="text-gray-600">Time Taken</p>
                <p className="text-sm text-gray-500">of {formatTime(totalTime)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Overall Performance</span>
                <span className={scoreLevel.color}>{scoreLevel.level}</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/user/dashboard')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate(`/quiz/${quizData.id}`)}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Detailed Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {quizData.questions.map((question, index) => {
                  const userAnswer = userAnswers[index]
                  const correctAnswer = question.correctAnswer !== undefined ? question.correctAnswer : question.correct_answer
                  const isCorrect = userAnswer === correctAnswer
                  const wasAnswered = userAnswer !== undefined

                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Question {index + 1}
                          </Badge>
                          {wasAnswered ? (
                            isCorrect ? (
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Correct
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 border-red-300">
                                <XCircle className="w-3 h-3 mr-1" />
                                Incorrect
                              </Badge>
                            )
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                              Not Answered
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {question.marks || 1} {question.marks === 1 ? 'mark' : 'marks'}
                        </span>
                      </div>

                      <h3 className="font-medium text-gray-800 mb-3">
                        {question.text}
                      </h3>

                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isUserAnswer = userAnswer === optionIndex
                          const isCorrectAnswer = correctAnswer === optionIndex
                          
                          let optionClass = "p-3 rounded border text-sm"
                          
                          if (isCorrectAnswer) {
                            optionClass += " bg-green-50 border-green-300 text-green-800"
                          } else if (isUserAnswer && !isCorrect) {
                            optionClass += " bg-red-50 border-red-300 text-red-800"
                          } else {
                            optionClass += " bg-gray-50 border-gray-200"
                          }

                          return (
                            <div key={optionIndex} className={optionClass}>
                              <div className="flex items-center justify-between">
                                <span>
                                  <span className="font-medium mr-2">
                                    ({String.fromCharCode(65 + optionIndex)})
                                  </span>
                                  {option}
                                </span>
                                <div className="flex gap-1">
                                  {isCorrectAnswer && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}