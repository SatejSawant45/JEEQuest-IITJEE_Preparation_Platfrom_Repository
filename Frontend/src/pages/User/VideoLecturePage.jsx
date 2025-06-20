import { useState } from "react";
import { Search, Play, Clock, Users, BookOpen, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const videoLectures = {
  mathematics: [
    {
      id: 1,
      title: "Calculus Fundamentals: Limits and Derivatives",
      instructor: "Dr. Sarah Johnson",
      duration: "45:30",
      views: "12.5K",
      thumbnail: "/placeholder.svg?height=200&width=300",
      description: "Introduction to calculus concepts including limits, continuity, and basic derivatives.",
      level: "Beginner",
      uploadDate: "2 days ago",
    },
    {
      id: 2,
      title: "Linear Algebra: Matrix Operations",
      instructor: "Prof. Michael Chen",
      duration: "38:15",
      views: "8.2K",
      thumbnail: "/placeholder.svg?height=200&width=300",
      description: "Comprehensive guide to matrix operations, determinants, and eigenvalues.",
      level: "Intermediate",
      uploadDate: "1 week ago",
    },
    {
      id: 3,
      title: "Statistics and Probability Theory",
      instructor: "Dr. Emily Rodriguez",
      duration: "52:45",
      views: "15.3K",
      thumbnail: "/placeholder.svg?height=200&width=300",
      description: "Understanding probability distributions, hypothesis testing, and statistical inference.",
      level: "Advanced",
      uploadDate: "3 days ago",
    },
  ],
  physics: [
    {
      id: 4,
      title: "Quantum Mechanics: Wave-Particle Duality",
      instructor: "Dr. Robert Kim",
      duration: "41:20",
      views: "9.7K",
      thumbnail: "/placeholder.svg?height=200&width=300",
      description: "Exploring the fundamental principles of quantum mechanics and wave functions.",
      level: "Advanced",
      uploadDate: "5 days ago",
    },
    {
      id: 5,
      title: "Classical Mechanics: Newton's Laws",
      instructor: "Prof. Lisa Wang",
      duration: "35:10",
      views: "18.4K",
      thumbnail: "/placeholder.svg?height=200&width=300",
      description: "Comprehensive overview of classical mechanics and Newton's three laws of motion.",
      level: "Beginner",
      uploadDate: "1 week ago",
    },
    {
      id: 6,
      title: "Thermodynamics and Heat Transfer",
      instructor: "Dr. James Miller",
      duration: "48:35",
      views: "11.2K",
      thumbnail: "/placeholder.svg?height=200&width=300",
      description: "Understanding heat, work, and energy transfer in thermodynamic systems.",
      level: "Intermediate",
      uploadDate: "4 days ago",
    },
  ],
  "computer-science": [
    {
      id: 7,
      title: "Data Structures: Trees and Graphs",
      instructor: "Prof. Alex Thompson",
      duration: "55:25",
      views: "22.1K",
      thumbnail: "/placeholder.svg?height=200&width=300",
      description: "Deep dive into tree and graph data structures with practical implementations.",
      level: "Intermediate",
      uploadDate: "2 days ago",
    },
    {
      id: 8,
      title: "Machine Learning: Neural Networks",
      instructor: "Dr. Priya Patel",
      duration: "62:40",
      views: "28.5K",
      thumbnail: "/placeholder.svg?height=200&width=300",
      description: "Introduction to neural networks, backpropagation, and deep learning concepts.",
      level: "Advanced",
      uploadDate: "6 days ago",
    },
    {
      id: 9,
      title: "Web Development: React Fundamentals",
      instructor: "Sarah Davis",
      duration: "43:15",
      views: "31.7K",
      thumbnail: "/placeholder.svg?height=200&width=300",
      description: "Learn React basics including components, state management, and hooks.",
      level: "Beginner",
      uploadDate: "1 day ago",
    },
  ],
  chemistry: [
    {
      id: 10,
      title: "Organic Chemistry: Reaction Mechanisms",
      instructor: "Dr. Mark Wilson",
      duration: "39:50",
      views: "7.8K",
      thumbnail: "/placeholder.svg?height=200&width=300",
      description: "Understanding organic reaction mechanisms and stereochemistry.",
      level: "Intermediate",
      uploadDate: "3 days ago",
    },
    {
      id: 11,
      title: "Physical Chemistry: Chemical Kinetics",
      instructor: "Prof. Anna Lee",
      duration: "46:30",
      views: "6.4K",
      thumbnail: "/placeholder.svg?height=200&width=300",
      description: "Study of reaction rates, rate laws, and catalysis in chemical systems.",
      level: "Advanced",
      uploadDate: "1 week ago",
    },
  ],
};

const subjects = [
  { id: "all", name: "All Subjects", icon: BookOpen },
  { id: "mathematics", name: "Mathematics", icon: BookOpen },
  { id: "physics", name: "Physics", icon: BookOpen },
  { id: "computer-science", name: "Computer Science", icon: BookOpen },
  { id: "chemistry", name: "Chemistry", icon: BookOpen },
];

export default function VideoLecturesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [activeSubject, setActiveSubject] = useState("all");

  const getAllVideos = () => {
    if (activeSubject === "all") {
      return Object.values(videoLectures).flat();
    }
    return videoLectures[activeSubject] || [];
  };

  const filteredVideos = getAllVideos().filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || video.level.toLowerCase() === selectedLevel.toLowerCase();
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Video Lectures</h1>
                <p className="text-muted-foreground mt-1">
                  Explore our comprehensive collection of educational content
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  {filteredVideos.length} lectures available
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search lectures, instructors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[140px] h-11">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeSubject} onValueChange={setActiveSubject} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8">
            {subjects.map((subject) => (
              <TabsTrigger key={subject.id} value={subject.id} className="flex items-center gap-2">
                <subject.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{subject.name}</span>
                <span className="sm:hidden">{subject.name.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {subjects.map((subject) => (
            <TabsContent key={subject.id} value={subject.id}>
              {filteredVideos.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No lectures found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <Card key={video.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                      <div className="relative">
                        <img
                          src={video.thumbnail || "/placeholder.svg?height=200&width=300"}
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                          <Button
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white text-black"
                          >
                            <Play className="h-5 w-5 ml-0.5" />
                          </Button>
                        </div>
                        <Badge className={`absolute top-2 right-2 ${getLevelColor(video.level)}`}>{video.level}</Badge>
                      </div>

                      <CardHeader className="pb-2">
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{video.instructor}</p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{video.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {video.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {video.views}
                            </div>
                          </div>
                          <span className="text-xs">{video.uploadDate}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
