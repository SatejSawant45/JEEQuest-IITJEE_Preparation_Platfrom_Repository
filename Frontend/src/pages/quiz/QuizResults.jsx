import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, TrendingUp, Home } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { saveQuizAttempt, getPerformanceLevel } from '@/lib/quizHistory'
import MathRenderer from '@/components/MathRenderer'

export default function QuizResults() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get results data passed from the quiz component
  const { 
    quizData, 
    userAnswers, 
    backendAnswers, // Backend processed answers with isCorrect info
    score, 
    percentage, 
    timeTaken,
    totalTime,
    fromBackend 
  } = location.state || {}

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const scoreLevel = percentage !== undefined ? getPerformanceLevel(percentage) : { level: 'N/A', color: '', bgColor: '' }

  // Redirect if no data is available - must be in useEffect to avoid hooks violation
  useEffect(() => {
    if (!quizData || !userAnswers) {
      navigate('/user/dashboard', { replace: true })
    }
  }, [quizData, userAnswers, navigate])

  // Prevent browser back button navigation from results page
  useEffect(() => {
    // Push a new state to prevent going back to quiz attempt
    window.history.pushState(null, '', window.location.href)
    
    const preventBackNavigation = (e) => {
      // When user tries to go back, push the current state again
      window.history.pushState(null, '', window.location.href)
    }
    
    window.addEventListener('popstate', preventBackNavigation)
    
    return () => {
      window.removeEventListener('popstate', preventBackNavigation)
    }
  }, [])

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

  // Show nothing while redirecting if no data
  if (!quizData || !userAnswers) {
    return null
  }

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
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/user/dashboard')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
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
                  
                  // Get isCorrect and correctAnswer from backend response
                  const backendAnswer = backendAnswers && backendAnswers[index]
                  const isCorrect = backendAnswer ? backendAnswer.isCorrect : false
                  const correctAnswer = backendAnswer ? backendAnswer.correctAnswer : (question.correctAnswer || null)
                  const wasAnswered = userAnswer !== undefined

                  console.log(`===== Question ${index + 1} =====`)
                  console.log('User answer:', userAnswer, typeof userAnswer)
                  console.log('Backend answer data:', backendAnswer)
                  console.log('isCorrect from backend:', isCorrect)
                  console.log('Correct answer:', correctAnswer)

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
                        <MathRenderer text={question.text} />
                      </h3>
                      {question.image && question.image.url && (
                        <img 
                          src={question.image.url} 
                          alt={question.image.alt || 'Question image'} 
                          className="mb-3 max-w-md h-auto rounded-lg border shadow-sm max-h-64 object-contain"
                        />
                      )}

                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const optionText = typeof option === 'string' ? option : option.text;
                          const optionImage = typeof option === 'object' ? option.image : null;
                          const userAnswerNum = Number(userAnswer)
                          const correctAnswerNum = correctAnswer !== null ? Number(correctAnswer) : null
                          const isUserAnswer = !isNaN(userAnswerNum) && userAnswerNum === optionIndex
                          const isCorrectOption = correctAnswerNum !== null && !isNaN(correctAnswerNum) && correctAnswerNum === optionIndex
                          
                          console.log(`  Option ${optionIndex}: isUserAnswer=${isUserAnswer}, isCorrectOption=${isCorrectOption}, isCorrect=${isCorrect}`)
                          
                          // Determine styling based on whether this was user's answer and if it was correct
                          let optionClass = "p-3 rounded border text-sm"
                          let labels = []
                          
                          // If backend says the answer is correct and this is user's answer, show it as correct
                          if (isUserAnswer && isCorrect) {
                            // User selected this and backend confirmed it's correct
                            optionClass += " bg-green-50 border-green-300 text-green-800 font-medium"
                            labels.push({ text: "Your Answer ✓", color: "green" })
                          } else if (isUserAnswer && !isCorrect) {
                            // User selected this but backend says it's wrong
                            optionClass += " bg-red-50 border-red-300 text-red-800"
                            labels.push({ text: "Your Answer ✗", color: "red" })
                          } else if (isCorrectOption && !isUserAnswer) {
                            // This is the correct answer but user didn't select it
                            optionClass += " bg-green-50 border-green-300 text-green-800"
                            labels.push({ text: "Correct Answer", color: "green" })
                          } else {
                            optionClass += " bg-gray-50 border-gray-200"
                          }

                          return (
                            <div key={optionIndex} className={optionClass}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <span className="font-medium mr-2">
                                    ({String.fromCharCode(65 + optionIndex)})
                                  </span>
                                  <MathRenderer text={optionText} className="inline" />
                                  {optionImage && optionImage.url && (
                                    <img 
                                      src={optionImage.url} 
                                      alt={optionImage.alt || `Option ${optionIndex + 1}`} 
                                      className="mt-2 max-w-xs h-auto rounded border max-h-32 object-contain"
                                    />
                                  )}
                                </div>
                                <div className="flex gap-2 items-center">
                                  {labels.map((label, idx) => (
                                    <span key={idx} className={`text-xs font-medium ${label.color === 'green' ? 'text-green-700' : 'text-red-700'}`}>
                                      {label.text}
                                    </span>
                                  ))}
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