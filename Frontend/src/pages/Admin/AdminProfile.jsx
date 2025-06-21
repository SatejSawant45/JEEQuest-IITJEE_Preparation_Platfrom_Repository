import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Edit,
  MessageCircle,
  UserPlus,
  Star,
  Briefcase,
  GraduationCap,
  Heart,
  Eye,
  ThumbsUp,
} from "lucide-react"

export default function AdminProfile() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-b-lg"></div>

        {/* Profile Info Overlay */}
        <div className="absolute -bottom-16 left-8">
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Sarah Johnson" />
            <AvatarFallback className="text-2xl">SJ</AvatarFallback>
          </Avatar>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Follow
          </Button>
          <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle className="text-2xl">Sarah Johnson</CardTitle>
                  <CardDescription className="text-lg">Senior Product Designer</CardDescription>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    San Francisco, CA
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Passionate about creating intuitive user experiences and building products that make a difference. 5+
                  years in design with a focus on SaaS and mobile applications.
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">UI/UX Design</Badge>
                  <Badge variant="secondary">Figma</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Design Systems</Badge>
                </div>

                <Separator />

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                    sarah.johnson@email.com
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                    +1 (555) 123-4567
                  </div>
                  <div className="flex items-center text-sm">
                    <Globe className="w-4 h-4 mr-3 text-muted-foreground" />
                    sarahjohnson.design
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                    Joined March 2020
                  </div>
                </div>

                <Separator />

                {/* Social Links */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Github className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">127</div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">2.4k</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">89</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">4.8</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* About Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p>
                      I'm a Senior Product Designer with over 5 years of experience creating digital experiences that
                      users love. My passion lies in solving complex problems through simple, elegant design solutions.
                    </p>
                    <p>
                      Currently leading design at TechCorp, where I've helped increase user engagement by 40% and reduce
                      support tickets by 25% through thoughtful UX improvements and design system implementation.
                    </p>
                  </CardContent>
                </Card>

                {/* Skills Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>UI/UX Design</span>
                          <span>95%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "95%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Figma</span>
                          <span>90%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Frontend Development</span>
                          <span>75%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Design Systems</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-6">
                <div className="grid gap-6">
                  {[1, 2, 3].map((project) => (
                    <Card key={project}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>E-commerce Mobile App Redesign</CardTitle>
                            <CardDescription>Complete UX overhaul for better conversion rates</CardDescription>
                          </div>
                          <Badge>Featured</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              1.2k views
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              89 likes
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              12 comments
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Project
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Senior Product Designer</h3>
                        <p className="text-sm text-muted-foreground">TechCorp • 2022 - Present</p>
                        <p className="text-sm mt-2">
                          Leading design for core product features, managing design system, and mentoring junior
                          designers.
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Product Designer</h3>
                        <p className="text-sm text-muted-foreground">StartupXYZ • 2020 - 2022</p>
                        <p className="text-sm mt-2">
                          Designed user experiences for B2B SaaS platform, conducted user research, and created design
                          systems.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Bachelor of Fine Arts in Graphic Design</h3>
                        <p className="text-sm text-muted-foreground">
                          University of California, Berkeley • 2016 - 2020
                        </p>
                        <p className="text-sm mt-2">
                          Graduated Magna Cum Laude with focus on digital design and user experience.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((activity) => (
                    <Card key={activity}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Johnson" />
                            <AvatarFallback>SJ</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">Sarah Johnson</span>
                              <span className="text-sm text-muted-foreground">shared a new project</span>
                              <span className="text-sm text-muted-foreground">2 hours ago</span>
                            </div>
                            <p className="text-sm mb-3">
                              Just finished working on a new dashboard design for our analytics platform. Really excited
                              about the data visualization improvements!
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <button className="flex items-center gap-1 hover:text-foreground">
                                <ThumbsUp className="w-4 h-4" />
                                24 likes
                              </button>
                              <button className="flex items-center gap-1 hover:text-foreground">
                                <MessageCircle className="w-4 h-4" />8 comments
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
