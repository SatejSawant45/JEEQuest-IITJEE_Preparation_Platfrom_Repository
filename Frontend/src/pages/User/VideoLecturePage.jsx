import { useState, useEffect } from "react";
import { Search, Play, Clock, BookOpen, Filter, Loader2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VideoLecturesPage() {
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState("all");
  const [lectures, setLectures] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLectures();
    fetchSubjects();
  }, []);

  const fetchLectures = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const url = activeSubject === "all" 
        ? `${primaryBackendUrl}/api/lectures`
        : `${primaryBackendUrl}/api/lectures?subject=${activeSubject}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setLectures(data.lectures);
      } else {
        console.error("Failed to fetch lectures");
      }
    } catch (error) {
      console.error("Error fetching lectures:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${primaryBackendUrl}/api/lectures/subjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const subjectList = [
          { id: "all", name: "All Subjects", icon: BookOpen },
          ...data.subjects.map((subject) => ({
            id: subject,
            name: subject,
            icon: BookOpen,
          })),
        ];
        setSubjects(subjectList);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [activeSubject]);

  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const openYoutubeVideo = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
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
                  {filteredLectures.length} lectures available
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search lectures, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading lectures...</span>
          </div>
        ) : subjects.length > 0 ? (
          <Tabs value={activeSubject} onValueChange={setActiveSubject} className="w-full">
            <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: `repeat(${subjects.length}, minmax(0, 1fr))` }}>
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
                {filteredLectures.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No lectures found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? "Try adjusting your search criteria" : "No lectures available for this subject yet"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLectures.map((lecture) => (
                      <Card key={lecture._id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                        <div className="relative">
                          <img
                            src={lecture.thumbnail || "/placeholder.svg?height=200&width=300"}
                            alt={lecture.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=200&width=300";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                            <Button
                              size="icon"
                              onClick={() => openYoutubeVideo(lecture.youtubeUrl)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white text-black"
                            >
                              <Play className="h-5 w-5 ml-0.5" />
                            </Button>
                          </div>
                          <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">
                            {lecture.subject}
                          </Badge>
                        </div>

                        <CardHeader className="pb-2">
                          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {lecture.title}
                          </h3>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{lecture.description}</p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {lecture.duration}
                              </div>
                            </div>
                            <span className="text-xs">{formatDate(lecture.createdAt)}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4"
                            onClick={() => openYoutubeVideo(lecture.youtubeUrl)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Watch on YouTube
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No lectures available</h3>
            <p className="text-muted-foreground">Check back later for new content</p>
          </div>
        )}
      </div>
    </div>
  );
}
