"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
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
import MathRenderer from "@/components/MathRenderer";
import ImageUpload from "@/components/ImageUpload";

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
            image: null,  // Image for question
            answers: [
                { id: "1", text: "", isCorrect: false, image: null },
                { id: "2", text: "", isCorrect: false, image: null },
            ],
            points: 1,
        };
        setQuiz((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion],
        }));
    };

    const updateQuestion = (questionId, updates) => {
        console.log("🔄 Updating question:", questionId, "with:", updates);
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
                image: null,  // Image for answer option
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
        console.log("🔍 Current quiz state:", quiz);
        console.log("🔍 Questions in state:", quiz.questions);
        
        // Frontend validation
        if (!quiz.title.trim()) {
            alert("⚠️ Please enter a quiz title");
            return;
        }
        if (!quiz.description.trim()) {
            alert("⚠️ Please enter a quiz description");
            return;
        }
        if (!quiz.subject.trim()) {
            alert("⚠️ Please select a subject");
            return;
        }
        if (!quiz.difficulty) {
            alert("⚠️ Please select a difficulty level");
            return;
        }
        if (quiz.questions.length === 0) {
            alert("⚠️ Please add at least one question");
            return;
        }

        // Validate each question
        for (let i = 0; i < quiz.questions.length; i++) {
            const q = quiz.questions[i];
            if (!q.question.trim()) {
                alert(`⚠️ Question ${i + 1} is empty. Please fill it in.`);
                return;
            }
            if (q.type !== "short-answer") {
                if (q.answers.length < 2) {
                    alert(`⚠️ Question ${i + 1} needs at least 2 answers`);
                    return;
                }
                const hasCorrect = q.answers.some(a => a.isCorrect);
                if (!hasCorrect) {
                    alert(`⚠️ Question ${i + 1} needs a correct answer selected`);
                    return;
                }
                const emptyAnswer = q.answers.find(a => !a.text.trim());
                if (emptyAnswer) {
                    alert(`⚠️ Question ${i + 1} has empty answer options`);
                    return;
                }
            }
        }

        const transformedQuiz = {
            title: quiz.title,
            subject: quiz.subject,
            description: quiz.description,
            duration: quiz.timeLimit,
            difficulty: quiz.difficulty,
            tags: quiz.tags || [],
            questions: quiz.questions.map((q) => ({
                question: q.question,
                image: q.image || null,  // Include question image
                type: q.type,
                answers: q.answers,  // full array with isCorrect, text, and image
                points: q.points,
            })),
        };

        console.log("📤 Sending quiz data:", transformedQuiz);
        console.log("📤 First question image:", transformedQuiz.questions[0]?.image);
        console.log("📤 First question answers:", transformedQuiz.questions[0]?.answers);

        try {
            let token = localStorage.getItem('jwtToken');
            if (!token) {
                alert("⚠️ You are not logged in. Please login again.");
                return;
            }

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
                const errorData = await response.json().catch(() => null);
                console.error("❌ Backend error:", errorData);
                
                if (response.status === 401) {
                    alert("⚠️ Your session has expired. Please login again.");
                    return;
                }
                
                if (errorData && errorData.errors) {
                    const errorMessages = errorData.errors.map(err => 
                        `${err.path}: ${err.msg}`
                    ).join('\n');
                    alert(`❌ Validation errors:\n${errorMessages}`);
                } else {
                    alert("❌ Failed to publish quiz. Please check all fields and try again.");
                }
                return;
            }

            const data = await response.json();
            console.log("✅ Quiz created:", data);
            alert("✅ Quiz published successfully!");
            
            // Reset form or redirect
            setQuiz({
                title: "",
                description: "",
                timeLimit: 30,
                passingScore: 70,
                subject: "",
                difficulty: "Beginner",
                tags: [],
                questions: [],
            });
        } catch (error) {
            console.error("❌ Server error:", error);
            alert("⚠️ Network error. Please check your connection and try again.");
        }
    };


    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 ml-64 p-6">
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

                {/* LaTeX Help Card */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            📐 Using Mathematical Equations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium mb-2">Common Examples:</p>
                                <ul className="space-y-1 text-xs">
                                    <li><code className="bg-white px-2 py-1 rounded">$x^2$</code> → <MathRenderer text="$x^2$" className="inline" /></li>
                                    <li><code className="bg-white px-2 py-1 rounded">$\frac{'{'}a{'}'}{'{'}{'}'}b{'}'}$</code> → <MathRenderer text="$\frac{a}{b}$" className="inline" /></li>
                                    <li><code className="bg-white px-2 py-1 rounded">$\sqrt{'{'}x{'}'}$</code> → <MathRenderer text="$\sqrt{x}$" className="inline" /></li>
                                    <li><code className="bg-white px-2 py-1 rounded">$\alpha, \beta, \gamma$</code> → <MathRenderer text="$\alpha, \beta, \gamma$" className="inline" /></li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-medium mb-2">Usage:</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• Inline: <code className="bg-white px-2 py-1 rounded">$equation$</code></li>
                                    <li>• Display: <code className="bg-white px-2 py-1 rounded">$$equation$$</code></li>
                                    <li>• Subscript: <code className="bg-white px-2 py-1 rounded">$x_1$</code> → <MathRenderer text="$x_1$" className="inline" /></li>
                                    <li>• Superscript: <code className="bg-white px-2 py-1 rounded">$x^2$</code> → <MathRenderer text="$x^2$" className="inline" /></li>
                                </ul>
                            </div>
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
                                                placeholder="Enter your question... Use $...$ for math, e.g., $x^2 + 5x + 6 = 0$"
                                                value={question.question}
                                                onChange={(e) =>
                                                    updateQuestion(question.id, { question: e.target.value })
                                                }
                                                rows={3}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                💡 Math equations: Use <code className="px-1 py-0.5 bg-gray-100 rounded">$x^2$</code> for inline or <code className="px-1 py-0.5 bg-gray-100 rounded">$$\frac{'{'}a{'{'}'}{'{'}{'}'}b{'{'}'}$$</code> for display
                                            </p>
                                            {question.question && (
                                                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                                    <p className="text-xs font-semibold text-blue-900 mb-1">Preview:</p>
                                                    <MathRenderer text={question.question} className="text-sm" />
                                                </div>
                                            )}
                                            <div className="mt-3">
                                                <Label className="text-xs text-gray-600 mb-1">Question Image (Optional)</Label>
                                                <ImageUpload
                                                    label="Add Image to Question"
                                                    currentImage={question.image}
                                                    onImageUpload={(imageData) => 
                                                        updateQuestion(question.id, { image: imageData })
                                                    }
                                                    onImageRemove={() => 
                                                        updateQuestion(question.id, { image: null })
                                                    }
                                                    folder="quiz-questions"
                                                />
                                            </div>
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
                                                            className="flex items-start space-x-3 p-3 border rounded-lg"
                                                        >
                                                            <RadioGroupItem
                                                                value={answer.id}
                                                                id={`${question.id}-${answer.id}`}
                                                                className="mt-3"
                                                            />
                                                            <div className="flex-1 space-y-2">
                                                                <Input
                                                                    placeholder={`Option ${answerIndex + 1} (you can use $math$ here too)`}
                                                                    value={answer.text}
                                                                    onChange={(e) =>
                                                                        updateAnswer(question.id, answer.id, {
                                                                            text: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                                {answer.text && (
                                                                    <div className="p-2 bg-gray-50 border border-gray-200 rounded text-xs">
                                                                        <MathRenderer text={answer.text} />
                                                                    </div>
                                                                )}
                                                                <ImageUpload
                                                                    label="Add Image"
                                                                    currentImage={answer.image}
                                                                    onImageUpload={(imageData) =>
                                                                        updateAnswer(question.id, answer.id, { image: imageData })
                                                                    }
                                                                    onImageRemove={() =>
                                                                        updateAnswer(question.id, answer.id, { image: null })
                                                                    }
                                                                    folder="quiz-options"
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
        </div>
    );
}
