import { useEffect, useMemo, useState } from "react";
import { Search, Clock, Users, BookOpen, Star, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function QuizPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [quizzes, setQuizzes] = useState([]); // 🔁 dynamic quizzes
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("jwtToken"); // or wherever you store it
        const res = await fetch(`${primaryBackendUrl}/api/quiz`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch quizzes");
        }

        const data = await res.json();
        setQuizzes(data.quizzes); // 👈 update state with backend quizzes
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const subjects = useMemo(() => ["All Subjects", ...Array.from(new Set(quizzes.map((quiz) => quiz.subject)))], [quizzes]);
  const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSubject = selectedSubject === "All Subjects" || quiz.subject === selectedSubject;
      const matchesDifficulty = selectedDifficulty === "All Levels" || quiz.difficulty === selectedDifficulty;

      return matchesSearch && matchesSubject && matchesDifficulty;
    });
  }, [searchTerm, selectedSubject, selectedDifficulty, quizzes]);

  const groupedQuizzes = useMemo(() => {
    const grouped = {};
    filteredQuizzes.forEach((quiz) => {
      if (!grouped[quiz.subject]) {
        grouped[quiz.subject] = [];
      }
      grouped[quiz.subject].push(quiz);
    });
    return grouped;
  }, [filteredQuizzes]);

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDialogOpen(true);
  };

  const handleConfirmStart = () => {
    if (selectedQuiz) {
      navigate(`/user/takequiz/${selectedQuiz._id}`);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Quiz Library</h1>
              <p className="text-muted-foreground">
                Discover and take quizzes across various subjects to test your knowledge
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes, topics, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quizzes found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters to find more quizzes.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedQuizzes).map(([subject, subjectQuizzes]) => (
              <div key={subject} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold">{subject}</h2>
                  <Badge variant="secondary" className="text-sm">
                    {subjectQuizzes.length} quiz{subjectQuizzes.length !== 1 ? "zes" : ""}
                  </Badge>
                </div>
                <Separator />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {subjectQuizzes.map((quiz) => (
                    <Card key={quiz._id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg leading-tight">{quiz.title}</CardTitle>
                          <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                        </div>
                        <CardDescription className="text-sm leading-relaxed">{quiz.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{quiz.duration}min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>{quiz.questions.length}q</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{quiz.participants.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{quiz.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({quiz.participants.toLocaleString()} participants)
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {quiz.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {quiz.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{quiz.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        <Button className="w-full" onClick={() => handleStartQuiz(quiz)}>
                          Start Quiz
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedQuiz && (
                <>
                  You are about to start <strong>{selectedQuiz.title}</strong>.
                  <br />
                  <br />
                  This quiz has <strong>{selectedQuiz.questions.length} questions</strong> and should take approximately <strong>{selectedQuiz.duration} minutes</strong> to complete.
                  <br />
                  <br />
                  Are you sure you want to begin?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStart}>
              Yes, Start Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
