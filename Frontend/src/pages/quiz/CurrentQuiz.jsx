import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Flag, CheckCircle, BookOpen, Timer, Send } from "lucide-react"

// Sample quiz data
const quizData = {
  title: "JavaScript Fundamentals Quiz",
  totalQuestions: 15,
  timeLimit: 30,
  questions: [
    {
      id: 1,
      question: "What is the correct way to declare a variable in JavaScript?",
      options: ["var myVariable = 5;", "variable myVariable = 5;", "v myVariable = 5;", "declare myVariable = 5;"],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "Which method is used to add an element to the end of an array?",
      options: ["append()", "push()", "add()", "insert()"],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "What does '===' operator do in JavaScript?",
      options: ["Assigns a value", "Compares values only", "Compares both value and type", "Declares a variable"],
      correctAnswer: 2,
    },
    {
      id: 4,
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Float", "Undefined"],
      correctAnswer: 2,
    },
    {
      id: 5,
      question: "How do you create a function in JavaScript?",
      options: [
        "function myFunction() {}",
        "create myFunction() {}",
        "def myFunction() {}",
        "function = myFunction() {}",
      ],
      correctAnswer: 0,
    },
  ],
}

export default function CurrnetQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit * 60)
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set())
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
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

  const goToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex)
  }

  const nextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const toggleFlag = (questionIndex) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex)
      } else {
        newSet.add(questionIndex)
      }
      return newSet
    })
  }

  const getQuestionStatus = (questionIndex) => {
    if (answers.hasOwnProperty(questionIndex)) return "answered"
    if (questionIndex === currentQuestion) return "current"
    return "unanswered"
  }

  const progress = (Object.keys(answers).length / quizData.questions.length) * 100
  const currentQuestionData = quizData.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {quizData.title}
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Question {currentQuestion + 1} of {quizData.totalQuestions}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Timer className="w-5 h-5" />
                  <span className={timeLeft < 300 ? "text-red-600" : "text-green-600"}>{formatTime(timeLeft)}</span>
                </div>

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
                        You have answered {Object.keys(answers).length} out of {quizData.totalQuestions} questions.
                        Are you sure you want to submit your quiz?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                        Continue Quiz
                      </Button>
                      <Button onClick={() => alert("Quiz submitted!")}>Submit Quiz</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                          variant={status === "current" ? "default" : "outline"}
                          size="sm"
                          className={`relative h-10 ${
                            status === "answered" ? "border-green-500 bg-green-50" : ""
                          } ${isFlagged ? "border-orange-500" : ""}`}
                          onClick={() => goToQuestion(index)}
                        >
                          {index + 1}
                          {status === "answered" && (
                            <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-green-600 bg-white rounded-full" />
                          )}
                          {isFlagged && (
                            <Flag className="w-3 h-3 absolute -top-1 -left-1 text-orange-600 bg-white rounded-full" />
                          )}
                        </Button>
                      )
                    })}
                  </div>
                </ScrollArea>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
                    <span>Answered ({Object.keys(answers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                    <span>Unanswered ({quizData.totalQuestions - Object.keys(answers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-orange-600" />
                    <span>Flagged ({flaggedQuestions.size})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Question {currentQuestion + 1}</Badge>
                      {flaggedQuestions.has(currentQuestion) && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          <Flag className="w-3 h-3 mr-1" />
                          Flagged
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl leading-relaxed">{currentQuestionData.question}</CardTitle>
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
                  value={answers[currentQuestion] !== undefined ? answers[currentQuestion].toString() : ""}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                  className="space-y-3"
                >
                  {currentQuestionData.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm leading-relaxed">
                        <span className="font-medium mr-2">({String.fromCharCode(65 + index)})</span>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between items-center pt-6 border-t">
                  <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
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
                  </div>

                  <Button onClick={nextQuestion} disabled={currentQuestion === quizData.questions.length - 1}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{Object.keys(answers).length}</div>
                  <div className="text-sm text-muted-foreground">Answered</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {quizData.totalQuestions - Object.keys(answers).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{flaggedQuestions.size}</div>
                  <div className="text-sm text-muted-foreground">Flagged</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
