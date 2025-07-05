import { useState } from "react"
import {
  BookOpen,
  MessageCircle,
  Video,
  Bot,
  BarChart3,
  FileText,
  Star,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Award,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const features = [
  {
    title: "Practice Quizzes",
    description: "Test your knowledge with curated JEE questions across Physics, Chemistry, and Mathematics",
    icon: BookOpen,
    link: "/quiz",
    stats: "500+ Questions",
    difficulty: "All Levels",
    time: "15-45min",
    participants: "2.5k",
  },
  {
    title: "Chat with Mentor",
    description: "Get instant help and guidance from experienced JEE mentors and subject experts",
    icon: MessageCircle,
    link: "/chat-mentor",
    stats: "24/7 Available",
    difficulty: "Interactive",
    time: "Real-time",
    participants: "Active",
  },
  {
    title: "Video Call Sessions",
    description: "One-on-one video sessions with top JEE educators for personalized learning",
    icon: Video,
    link: "/video-call",
    stats: "Live Sessions",
    difficulty: "Personalized",
    time: "60min",
    participants: "1-on-1",
  },
  {
    title: "AI Study Assistant",
    description: "Your personal AI tutor for instant doubt clearing and study guidance",
    icon: Bot,
    link: "/ai-chatbot",
    stats: "Instant Help",
    difficulty: "Smart",
    time: "24/7",
    participants: "Always",
  },
  {
    title: "Test Analysis",
    description: "Detailed performance analysis with insights and improvement suggestions",
    icon: BarChart3,
    link: "/test-analysis",
    stats: "Smart Insights",
    difficulty: "Advanced",
    time: "Post-test",
    participants: "Personal",
  },
  {
    title: "Study Blogs",
    description: "Expert articles, tips, strategies, and latest updates for JEE preparation",
    icon: FileText,
    link: "/blog",
    stats: "Weekly Updates",
    difficulty: "Informative",
    time: "5-10min",
    participants: "Open",
  },
]

const testimonials = [
  {
    name: "Arjun Sharma",
    rank: "AIR 47, JEE Advanced 2024",
    content:
      "This platform transformed my preparation strategy. The AI chatbot helped me clear doubts instantly, and the test analysis feature showed me exactly where to improve.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Priya Patel",
    rank: "AIR 156, JEE Advanced 2024",
    content:
      "The mentor chat feature was a game-changer. Having 24/7 access to experienced teachers made all the difference in my preparation.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Rohit Kumar",
    rank: "AIR 89, JEE Advanced 2024",
    content:
      "The practice quizzes are perfectly aligned with JEE patterns. The detailed explanations helped me understand concepts better.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
]

const faqs = [
  {
    question: "How does the AI chatbot help with JEE preparation?",
    answer:
      "Our AI chatbot is trained on JEE syllabus and can help you with concept clarification, problem-solving techniques, study planning, and instant doubt resolution 24/7.",
  },
  {
    question: "Are the mentors qualified JEE educators?",
    answer:
      "Yes, all our mentors are experienced JEE educators with proven track records. Many are IIT/NIT alumni who have successfully guided students to top ranks.",
  },
  {
    question: "How accurate is the test analysis feature?",
    answer:
      "Our test analysis uses advanced algorithms to identify your strengths and weaknesses, providing personalized recommendations based on your performance patterns.",
  },
  {
    question: "Can I access video call sessions anytime?",
    answer:
      "Video call sessions can be scheduled based on mentor availability. We offer flexible timing including early morning and late evening slots.",
  },
]

const quotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The expert in anything was once a beginner.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is the sum of small efforts repeated day in and day out.",
]

const getDifficultyBadge = (difficulty) => {
  const variants = {
    "All Levels": "bg-blue-100 text-blue-800",
    Interactive: "bg-green-100 text-green-800",
    Personalized: "bg-purple-100 text-purple-800",
    Smart: "bg-orange-100 text-orange-800",
    Advanced: "bg-red-100 text-red-800",
    Informative: "bg-gray-100 text-gray-800",
  }
  return variants[difficulty] || "bg-gray-100 text-gray-800"
}

export default function HomeDashboard() {
  const [openFaq, setOpenFaq] = useState(null)
  const [currentQuote, setCurrentQuote] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Continue your JEE preparation journey with our comprehensive tools and resources.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Practice Questions</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Expert Mentors</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">AI Support</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <feature.icon className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{feature.title}</CardTitle>
                        <Badge className={`text-xs mt-1 ${getDifficultyBadge(feature.difficulty)}`}>
                          {feature.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{feature.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{feature.participants}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={() => (window.location.href = feature.link)}
                  >
                    Start {feature.title.split(" ")[0]}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Motivational Quote */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Daily Motivation</span>
            </div>
            <p className="text-lg text-gray-800 italic mb-4">"{quotes[currentQuote]}"</p>
            <Button variant="outline" size="sm" onClick={() => setCurrentQuote((prev) => (prev + 1) % quotes.length)}>
              Next Quote
            </Button>
          </CardContent>
        </Card>

        {/* Student Success Stories */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-100 text-gray-700">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <Badge className="bg-green-100 text-green-800 text-xs">{testimonial.rank}</Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">"{testimonial.content}"</p>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white border border-gray-200">
                <Collapsible open={openFaq === index} onOpenChange={() => setOpenFaq(openFaq === index ? null : index)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-left text-base font-semibold text-gray-900">
                          {faq.question}
                        </CardTitle>
                        {openFaq === index ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Ready to boost your JEE preparation?</h3>
            <p className="text-gray-600 mb-6">
              Start with a practice quiz or chat with our mentors to get personalized guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white"
                onClick={() => (window.location.href = "/quiz")}
              >
                Take Practice Quiz
              </Button>
              <Button size="lg" variant="outline" onClick={() => (window.location.href = "/chat-mentor")}>
                Chat with Mentor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
