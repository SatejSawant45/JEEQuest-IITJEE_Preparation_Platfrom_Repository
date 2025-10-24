import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, Phone, MapPin, Calendar, GraduationCap, BookOpen, Edit, MessageCircle, Trophy, Clock, TrendingUp, BarChart3 } from "lucide-react"
import { formatDuration, getPerformanceLevel } from "@/lib/quizHistory"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const navigate = useNavigate()
  const [quizHistory, setQuizHistory] = useState([])
  const [quizStats, setQuizStats] = useState({})
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState(null)
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;

  const loadQuizData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("jwtToken");
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${primaryBackendUrl}/api/attempt/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz attempts');
      }

      const attempts = await response.json();
      console.log('Fetched attempts:', attempts);

      // Transform backend data to match frontend format
      const transformedHistory = attempts.map(attempt => ({
        id: attempt._id,
        quizId: attempt.quiz._id,
        quizTitle: attempt.quiz.title,
        score: attempt.correctAnswers,
        totalQuestions: attempt.totalQuestions,
        earnedMarks: attempt.score,
        totalMarks: attempt.totalMarks,
        percentage: attempt.percentage,
        completedAt: new Date(attempt.completedAt),
        performanceLevel: getPerformanceLevel(attempt.percentage).level
      }));
      
      // Calculate statistics
      const stats = {
        totalAttempts: transformedHistory.length,
        averageScore: transformedHistory.length > 0 
          ? Math.round((transformedHistory.reduce((sum, attempt) => sum + attempt.percentage, 0) / transformedHistory.length) * 10) / 10
          : 0,
        bestScore: transformedHistory.length > 0 
          ? Math.max(...transformedHistory.map(attempt => attempt.percentage))
          : 0,
        totalQuizzesCompleted: new Set(transformedHistory.map(attempt => attempt.quizId)).size
      };
      
      setQuizHistory(transformedHistory)
      setQuizStats(stats)
      setError(null)
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      setError(err.message);
      // Fallback to empty data
      setQuizHistory([])
      setQuizStats({
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        totalQuizzesCompleted: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async () => {
    try {
      setProfileLoading(true)
      const token = localStorage.getItem("jwtToken");
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${primaryBackendUrl}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const user = await response.json();
      console.log('Fetched user profile:', user);
      console.log('Profile picture URL:', user.profilePicture);
      console.log('Full profile picture URL:', user.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${primaryBackendUrl}${user.profilePicture}`) : 'No profile picture');
      setUserProfile(user);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // Don't set error here as we still want to show quiz data
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    loadQuizData()
    loadUserProfile()
  }, [])

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all quiz history? This cannot be undone.')) {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`${primaryBackendUrl}/api/attempt/user/clear`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await loadQuizData(); // Refresh the data
          alert('Quiz history cleared successfully!')
        } else {
          throw new Error('Failed to clear history');
        }
      } catch (err) {
        console.error('Error clearing history:', err);
        alert('Failed to clear quiz history. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage 
                    src={
                      userProfile?.profilePicture 
                        ? userProfile.profilePicture.startsWith('http') 
                          ? userProfile.profilePicture 
                          : `${primaryBackendUrl}${userProfile.profilePicture}`
                        : "/placeholder.svg?height=128&width=128"
                    } 
                    alt={userProfile?.name || "User"} 
                  />
                  <AvatarFallback className="text-2xl">
                    {userProfile?.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/user/dashboard/profile/edit')}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="text-center md:text-left">
                  {profileLoading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-64 mb-4"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                        <div className="h-4 bg-gray-200 rounded w-36"></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold mb-2">{userProfile?.name || 'User'}</h1>
                      <p className="text-xl text-muted-foreground mb-4">
                        {userProfile?.course ? `${userProfile.course} Student` : 'Student'}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {userProfile?.year || userProfile?.gpa ? (
                          <div className="flex items-center justify-center md:justify-start">
                            <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                            {[userProfile?.year, userProfile?.gpa ? `GPA: ${userProfile.gpa}` : ''].filter(Boolean).join(' • ') || 'Academic Info'}
                          </div>
                        ) : null}
                        {userProfile?.university && (
                          <div className="flex items-center justify-center md:justify-start">
                            <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                            {userProfile.university}
                          </div>
                        )}
                        {userProfile?.location && (
                          <div className="flex items-center justify-center md:justify-start">
                            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                            {userProfile.location}
                          </div>
                        )}
                        {userProfile?.graduationYear && (
                          <div className="flex items-center justify-center md:justify-start">
                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                            Graduating {userProfile.graduationYear}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profileLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-36"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                      {userProfile?.email || 'No email provided'}
                    </div>
                    {userProfile?.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                        {userProfile.phone}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="animate-pulse flex flex-wrap gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-14"></div>
                    <div className="h-6 bg-gray-200 rounded w-18"></div>
                  </div>
                ) : userProfile?.skills && userProfile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No skills added yet</p>
                )}
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="animate-pulse flex flex-wrap gap-2">
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-18"></div>
                  </div>
                ) : userProfile?.interests && userProfile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.map((interest) => (
                      <Badge key={interest} variant="outline">{interest}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No interests added yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                ) : userProfile?.about ? (
                  <p className="text-muted-foreground leading-relaxed">
                    {userProfile.about}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    No description added yet. Click Edit to add information about yourself.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            {!profileLoading && userProfile?.socialLinks && (
              userProfile.socialLinks.linkedin || 
              userProfile.socialLinks.github || 
              userProfile.socialLinks.portfolio
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userProfile.socialLinks.linkedin && (
                    <div className="flex items-center text-sm">
                      <div className="w-4 h-4 mr-3 text-blue-600">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <a 
                        href={userProfile.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {userProfile.socialLinks.github && (
                    <div className="flex items-center text-sm">
                      <div className="w-4 h-4 mr-3 text-gray-800">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <a 
                        href={userProfile.socialLinks.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:underline"
                      >
                        GitHub Profile
                      </a>
                    </div>
                  )}
                  {userProfile.socialLinks.portfolio && (
                    <div className="flex items-center text-sm">
                      <div className="w-4 h-4 mr-3 text-green-600">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <a 
                        href={userProfile.socialLinks.portfolio} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        Portfolio Website
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quiz Statistics */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Quiz Performance
                  </CardTitle>
                  {!loading && quizStats.totalAttempts > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleClearHistory}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Clear History
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading quiz history...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-4">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                      <p className="font-semibold">Failed to Load Quiz History</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={loadQuizData}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : quizStats.totalAttempts > 0 ? (
                  <div className="space-y-6">
                    {/* Statistics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {quizStats.totalAttempts}
                        </div>
                        <p className="text-sm text-muted-foreground">Total Attempts</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {quizStats.averageScore}%
                        </div>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {quizStats.bestScore}%
                        </div>
                        <p className="text-sm text-muted-foreground">Best Score</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {quizStats.totalQuizzesCompleted}
                        </div>
                        <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Recent Quiz History */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Recent Quiz Attempts
                      </h4>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {quizHistory.slice(0, 10).map((attempt) => {
                            const performanceLevel = getPerformanceLevel(attempt.percentage)
                            return (
                              <div key={attempt.id} className="border rounded-lg p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-sm">{attempt.quizTitle}</h5>
                                    <p className="text-xs text-muted-foreground">
                                      {attempt.completedAt.toLocaleDateString()} at{' '}
                                      {attempt.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                  <Badge className={`${performanceLevel.bgColor} ${performanceLevel.color} border-0 text-xs`}>
                                    {performanceLevel.level}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{attempt.percentage.toFixed(1)}%</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Trophy className="w-3 h-3" />
                                    <span>{attempt.score}/{attempt.totalQuestions}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDuration(attempt.timeTaken)}</span>
                                  </div>
                                </div>

                                {/* Mini progress bar */}
                                <div className="mt-2">
                                  <Progress value={attempt.percentage} className="h-1" />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h4 className="font-semibold mb-2">No Quiz Attempts Yet</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start taking quizzes to see your performance history here.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/user/dashboard/quizzes')}
                    >
                      Browse Quizzes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
