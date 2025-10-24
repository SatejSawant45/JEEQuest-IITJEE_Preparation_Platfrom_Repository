import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  BookOpen, Timer, Send, ChevronLeft, ChevronRight, Flag, CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"


export default function CurrentQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quizData, setQuizData] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set())
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [error, setError] = useState(null)
  const [startTime] = useState(Date.now())
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await fetch(`${primaryBackendUrl}/api/quiz/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json()

        console.log(data);
        console.log(data.quiz);
        if (!res.ok) throw new Error("Quiz not found")

        setQuizData(data)
        setTimeLeft(data.duration * 60)
      } catch (err) {
        console.error("Error fetching quiz:", err)
        setError("Failed to load quiz. Please try again later.")
      }
    }

    fetchQuiz()
  }, [id])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (quizData) {
      alert("Time's up! Submitting quiz.")
      handleSubmit()
    }
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerIndex,
    }))
  }

  const goToQuestion = (index) => setCurrentQuestion(index)
  const nextQuestion = () => setCurrentQuestion(prev => Math.min(prev + 1, quizData.questions.length - 1))
  const previousQuestion = () => setCurrentQuestion(prev => Math.max(prev - 1, 0))

  const toggleFlag = (index) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      newSet.has(index) ? newSet.delete(index) : newSet.add(index)
      return newSet
    })
  }

  const getQuestionStatus = (index) => {
    if (answers.hasOwnProperty(index)) return "answered"
    if (index === currentQuestion) return "current"
    return "unanswered"
  }

  const calculateScore = () => {
    let correctAnswers = 0
    let totalMarks = 0
    let earnedMarks = 0

    quizData.questions.forEach((question, index) => {
      const marks = question.marks || 1
      totalMarks += marks
      
      if (answers[index] === question.correctAnswer) {
        correctAnswers++
        earnedMarks += marks
      }
    })

    const percentage = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0
    
    return {
      score: correctAnswers,
      totalQuestions: quizData.questions.length,
      earnedMarks,
      totalMarks,
      percentage: Math.round(percentage * 10) / 10 // Round to 1 decimal place
    }
  }

  const handleSubmit = async () => {
    const endTime = Date.now()
    const timeTaken = Math.floor((endTime - startTime) / 1000) // in seconds
    const totalTime = quizData.duration * 60 // convert minutes to seconds
    
    const scoreData = calculateScore()
    
    console.log("Submitted answers:", answers)
    console.log("Score data:", scoreData)
    
    try {
      // Submit quiz attempt to backend
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${primaryBackendUrl}/api/attempt/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: answers, // answers object with questionIndex: selectedOption
          timeTaken: timeTaken
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz attempt');
      }

      const result = await response.json();
      console.log('Quiz attempt submitted successfully:', result);

      // Navigate to results page with backend response data
      navigate("/quiz-results", {
        state: {
          quizData,
          userAnswers: answers,
          score: result.attempt.correctAnswers,
          totalQuestions: result.attempt.totalQuestions,
          earnedMarks: result.attempt.score,
          totalMarks: result.attempt.totalMarks,
          percentage: result.attempt.percentage,
          timeTaken,
          totalTime,
          attemptId: result.attempt._id,
          fromBackend: true // Flag to indicate data is from backend
        }
      })
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      // Fallback to local calculation if backend fails
      alert('Failed to save quiz results to server, but showing results locally.');
      navigate("/quiz-results", {
        state: {
          quizData,
          userAnswers: answers,
          score: scoreData.score,
          totalQuestions: scoreData.totalQuestions,
          earnedMarks: scoreData.earnedMarks,
          totalMarks: scoreData.totalMarks,
          percentage: scoreData.percentage,
          timeTaken,
          totalTime,
          fromBackend: false
        }
      })
    }
  }

  if (error) {
    return <div className="p-6 text-red-600 text-center">{error}</div>
  }

  if (!quizData || !quizData.questions) {
    return <div className="p-6 text-center">Loading quiz...</div>
  }

  const progress = (Object.keys(answers).length / quizData.questions.length) * 100
  const question = quizData.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {quizData.title}
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Question {currentQuestion + 1} of {quizData.questions.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Timer className="w-5 h-5" />
                  <span className={timeLeft < 300 ? "text-red-600" : "text-green-600"}>
                    {formatTime(timeLeft)}
                  </span>
                </div>

                {/* Submit Dialog */}
                <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Submit Quiz?</DialogTitle>
                      <DialogDescription>
                        You’ve answered {Object.keys(answers).length} out of {quizData.questions.length} questions.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>Continue Quiz</Button>
                      <Button onClick={handleSubmit}>Submit Quiz</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                    {quizData.questions.map((_, index) => {
                      const status = getQuestionStatus(index)
                      const isFlagged = flaggedQuestions.has(index)
                      return (
                        <Button
                          key={index}
                          size="sm"
                          variant={status === "current" ? "default" : "outline"}
                          className={`relative h-10 ${status === "answered" ? "border-green-500 bg-green-50" : ""} ${isFlagged ? "border-orange-500" : ""}`}
                          onClick={() => goToQuestion(index)}
                        >
                          {index + 1}
                          {status === "answered" && <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-green-600 bg-white rounded-full" />}
                          {isFlagged && <Flag className="w-3 h-3 absolute -top-1 -left-1 text-orange-600 bg-white rounded-full" />}
                        </Button>
                      )
                    })}
                  </div>
                </ScrollArea>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                    <span>Unanswered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-orange-600" />
                    <span>Flagged ({flaggedQuestions.size})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Question {currentQuestion + 1}</Badge>
                      {flaggedQuestions.has(currentQuestion) && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          <Flag className="w-3 h-3 mr-1" /> Flagged
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl leading-relaxed">{question.text}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFlag(currentQuestion)}
                    className={flaggedQuestions.has(currentQuestion) ? "text-orange-600" : ""}
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <RadioGroup
                  value={answers[currentQuestion]?.toString() || ""}
                  onValueChange={(val) => handleAnswerSelect(parseInt(val))}
                  className="space-y-3"
                >
                  {question.options.map((opt, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                      <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer text-sm">
                        <span className="font-medium mr-2">({String.fromCharCode(65 + i)})</span>
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between items-center pt-6 border-t">
                  <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {answers[currentQuestion] !== undefined && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const newAnswers = { ...answers }
                        delete newAnswers[currentQuestion]
                        setAnswers(newAnswers)
                      }}
                    >
                      Clear Answer
                    </Button>
                  )}

                  <Button onClick={nextQuestion} disabled={currentQuestion === quizData.questions.length - 1}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
