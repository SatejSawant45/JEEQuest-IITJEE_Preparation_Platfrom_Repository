import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Calendar, GraduationCap, BookOpen, Edit, MessageCircle } from "lucide-react"

export default function Profile() {
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
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Alex Chen" />
                  <AvatarFallback className="text-2xl">AC</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
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
                  <h1 className="text-3xl font-bold mb-2">Alex Chen</h1>
                  <p className="text-xl text-muted-foreground mb-4">Computer Science Student</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-center md:justify-start">
                      <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                      Junior Year • GPA: 3.8
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                      Stanford University
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      Palo Alto, CA
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      Graduating 2025
                    </div>
                  </div>
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
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                  alex.chen@stanford.edu
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                  (555) 123-4567
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">JavaScript</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Java</Badge>
                  <Badge variant="secondary">SQL</Badge>
                  <Badge variant="secondary">Git</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Machine Learning</Badge>
                  <Badge variant="outline">Web Development</Badge>
                  <Badge variant="outline">Mobile Apps</Badge>
                  <Badge variant="outline">Data Science</Badge>
                </div>
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
                <p className="text-muted-foreground leading-relaxed">
                  I'm a junior Computer Science student at Stanford University with a passion for software development
                  and technology. Currently maintaining a 3.8 GPA while actively participating in coding competitions
                  and hackathons. I enjoy building web applications and exploring machine learning concepts.
                </p>
              </CardContent>
            </Card>

            {/* Academic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Major Courses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>• Data Structures & Algorithms</div>
                    <div>• Database Systems</div>
                    <div>• Software Engineering</div>
                    <div>• Machine Learning</div>
                    <div>• Computer Networks</div>
                    <div>• Operating Systems</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Activities</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Computer Science Club - Vice President</div>
                    <div>• ACM Programming Team Member</div>
                    <div>• Teaching Assistant for CS101</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">Task Management App</h4>
                  <p className="text-sm text-muted-foreground">
                    Built a full-stack web application using React and Node.js for managing student assignments and
                    deadlines.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">Weather Prediction Model</h4>
                  <p className="text-sm text-muted-foreground">
                    Developed a machine learning model using Python and scikit-learn to predict local weather patterns.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">Campus Event Finder</h4>
                  <p className="text-sm text-muted-foreground">
                    Created a mobile app with React Native to help students discover and join campus events.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
