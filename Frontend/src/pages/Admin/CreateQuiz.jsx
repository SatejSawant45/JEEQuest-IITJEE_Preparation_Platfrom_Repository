"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Save, Eye, Settings } from "lucide-react";

export default function CreateQuiz() {
    const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;
    const [quiz, setQuiz] = useState({
        title: "",
        description: "",
        timeLimit: 30,       // duration
        passingScore: 70,    // frontend-only (for reference)
        subject: "",         // 🔴 required
        difficulty: "Beginner", // 🔴 required
        tags: [],
        questions: [],
    });

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now().toString(),
            type: "multiple-choice",
            question: "",
            answers: [
                { id: "1", text: "", isCorrect: false },
                { id: "2", text: "", isCorrect: false },
            ],
            points: 1,
        };
        setQuiz((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion],
        }));
    };

    const updateQuestion = (questionId, updates) => {
        setQuiz((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q.id === questionId ? { ...q, ...updates } : q
            ),
        }));
    };

    const deleteQuestion = (questionId) => {
        setQuiz((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q.id !== questionId),
        }));
    };

    const addAnswer = (questionId) => {
        const question = quiz.questions.find((q) => q.id === questionId);
        if (question) {
            const newAnswer = {
                id: Date.now().toString(),
                text: "",
                isCorrect: false,
            };
            updateQuestion(questionId, {
                answers: [...question.answers, newAnswer],
            });
        }
    };

    const updateAnswer = (questionId, answerId, updates) => {
        const question = quiz.questions.find((q) => q.id === questionId);
        if (question) {
            updateQuestion(questionId, {
                answers: question.answers.map((a) =>
                    a.id === answerId ? { ...a, ...updates } : a
                ),
            });
        }
    };

    const deleteAnswer = (questionId, answerId) => {
        const question = quiz.questions.find((q) => q.id === questionId);
        if (question && question.answers.length > 2) {
            updateQuestion(questionId, {
                answers: question.answers.filter((a) => a.id !== answerId),
            });
        }
    };

    const setCorrectAnswer = (questionId, answerId) => {
        const question = quiz.questions.find((q) => q.id === questionId);
        if (question) {
            updateQuestion(questionId, {
                answers: question.answers.map((a) => ({
                    ...a,
                    isCorrect: a.id === answerId,
                })),
            });
        }
    };
    const handlePublishQuiz = async () => {
        const transformedQuiz = {
            title: quiz.title,
            subject: quiz.subject,
            description: quiz.description,
            duration: quiz.timeLimit,
            difficulty: quiz.difficulty,
            tags: quiz.tags || [],
            questions: quiz.questions.map((q) => ({
                question: q.question,
                type: q.type,
                answers: q.answers,  // full array with isCorrect and text
                points: q.points,
            })),
        };


        try {
            let token = localStorage.getItem('jwtToken');
            const response = await fetch(`${primaryBackendUrl}/api/quiz`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify(transformedQuiz),
            });

            if (!response.ok) {
                const errorText = await response.text(); // <- fallback if not JSON
                console.error("Backend error:", errorText);
                alert("❌ Failed to publish quiz. Server responded with an error.");
                return;
            }

            const data = await response.json(); // Only parse if response is OK
            console.log(data);
            alert("✅ Quiz published successfully!");
            console.log("Created quiz:", data);
        } catch (error) {
            console.error("❌ Server error:", error);
            alert("⚠️ Server error. Check console for details.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Quiz</h1>
                        <p className="text-muted-foreground">
                            Build and customize your quiz with questions and answers
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                        </Button>
                        <Button size="sm">
                            <Save className="mr-2 h-4 w-4" />
                            Save Quiz
                        </Button>
                    </div>
                </div>

                {/* Quiz Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Quiz Settings
                        </CardTitle>
                        <CardDescription>
                            Configure the basic settings for your quiz
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Quiz Title</Label>
                                <Input
                                    id="title"
                                    value={quiz.title}
                                    onChange={(e) =>
                                        setQuiz((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    placeholder="Enter quiz title..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                                <Input
                                    id="time-limit"
                                    type="number"
                                    min="1"
                                    value={quiz.timeLimit}
                                    onChange={(e) =>
                                        setQuiz((prev) => ({
                                            ...prev,
                                            timeLimit: parseInt(e.target.value) || 30,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        {/* Subject Field */}
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={quiz.subject}
                                onChange={(e) => setQuiz((prev) => ({ ...prev, subject: e.target.value }))}
                                placeholder="e.g. Physics, Chemistry"
                            />
                        </div>

                        {/* Difficulty Field */}
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty</Label>
                            <Select
                                value={quiz.difficulty}
                                onValueChange={(value) =>
                                    setQuiz((prev) => ({ ...prev, difficulty: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={quiz.description}
                                onChange={(e) =>
                                    setQuiz((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Describe what this quiz covers..."
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passing-score">Passing Score (%)</Label>
                            <Input
                                id="passing-score"
                                type="number"
                                min="0"
                                max="100"
                                value={quiz.passingScore}
                                onChange={(e) =>
                                    setQuiz((prev) => ({
                                        ...prev,
                                        passingScore: parseInt(e.target.value) || 70,
                                    }))
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Questions List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">
                            Questions ({quiz.questions.length})
                        </h2>
                        <Button onClick={addQuestion}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Question
                        </Button>
                    </div>

                    {quiz.questions.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12 space-y-4">
                                <h3 className="text-lg font-medium">No questions yet</h3>
                                <p className="text-muted-foreground">
                                    Start building your quiz by adding your first question
                                </p>
                                <Button onClick={addQuestion}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Question
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        quiz.questions.map((question, index) => (
                            <Card key={question.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2 items-center">
                                            <Badge variant="secondary">Question {index + 1}</Badge>
                                            <Badge variant="outline">
                                                {question.points} point{question.points !== 1 ? "s" : ""}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteQuestion(question.id)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-2 space-y-2">
                                            <Label>Question Text</Label>
                                            <Textarea
                                                placeholder="Enter your question..."
                                                value={question.question}
                                                onChange={(e) =>
                                                    updateQuestion(question.id, { question: e.target.value })
                                                }
                                                rows={2}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Question Type</Label>
                                            <Select
                                                value={question.type}
                                                onValueChange={(value) => {
                                                    const answers =
                                                        value === "true-false"
                                                            ? [
                                                                { id: "1", text: "True", isCorrect: false },
                                                                { id: "2", text: "False", isCorrect: false },
                                                            ]
                                                            : value === "short-answer"
                                                                ? []
                                                                : question.answers;

                                                    updateQuestion(question.id, { type: value, answers });
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                                    <SelectItem value="true-false">True/False</SelectItem>
                                                    <SelectItem value="short-answer">Short Answer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Points</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={question.points}
                                                onChange={(e) =>
                                                    updateQuestion(question.id, {
                                                        points: parseInt(e.target.value) || 1,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    {question.type !== "short-answer" && (
                                        <>
                                            <Separator />
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label>Answer Options</Label>
                                                    {question.type === "multiple-choice" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => addAnswer(question.id)}
                                                        >
                                                            <Plus className="mr-2 h-3 w-3" />
                                                            Add Option
                                                        </Button>
                                                    )}
                                                </div>
                                                <RadioGroup
                                                    value={
                                                        question.answers.find((a) => a.isCorrect)?.id || ""
                                                    }
                                                    onValueChange={(value) =>
                                                        setCorrectAnswer(question.id, value)
                                                    }
                                                >
                                                    {question.answers.map((answer, answerIndex) => (
                                                        <div
                                                            key={answer.id}
                                                            className="flex items-center space-x-3 p-3 border rounded-lg"
                                                        >
                                                            <RadioGroupItem
                                                                value={answer.id}
                                                                id={`${question.id}-${answer.id}`}
                                                            />
                                                            <div className="flex-1">
                                                                <Input
                                                                    placeholder={`Option ${answerIndex + 1}`}
                                                                    value={answer.text}
                                                                    onChange={(e) =>
                                                                        updateAnswer(question.id, answer.id, {
                                                                            text: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {answer.isCorrect && (
                                                                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                                                        Correct
                                                                    </Badge>
                                                                )}
                                                                {question.type === "multiple-choice" &&
                                                                    question.answers.length > 2 && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                deleteAnswer(question.id, answer.id)
                                                                            }
                                                                            className="text-destructive"
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </Button>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                                <p className="text-sm text-muted-foreground">
                                                    Select the correct answer by clicking the radio button next to it.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Footer */}
                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div className="text-sm text-muted-foreground">
                            {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""} •{" "}
                            {quiz.questions.reduce((sum, q) => sum + q.points, 0)} total points
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">Save as Draft</Button>
                            <Button onClick={handlePublishQuiz}>Publish Quiz</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
