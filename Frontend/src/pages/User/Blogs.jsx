"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  ImageIcon,
  Video,
  Send,
  Search,
  Bell,
  User,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

const mockPosts = [
  {
    id: 1,
    type: "blog",
    author: {
      name: "Sarah Chen",
      username: "@sarahchen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "Building Scalable React Applications: Best Practices for 2024",
    content:
      "In this comprehensive guide, I'll share the lessons I've learned building large-scale React applications over the past few years. From component architecture to state management, here are the patterns that have served me well...",
    image: "/placeholder.svg?height=300&width=600",
    tags: ["React", "JavaScript", "Web Development"],
    timestamp: "2 hours ago",
    likes: 124,
    comments: 18,
    shares: 7,
  },
  {
    id: 2,
    type: "question",
    author: {
      name: "Alex Rodriguez",
      username: "@alexdev",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "How to handle authentication in Next.js 14 with App Router?",
    content:
      "I'm struggling with implementing authentication in my Next.js 14 app using the new App Router. I've tried NextAuth but running into issues with middleware. Has anyone successfully implemented this? Looking for best practices and code examples.",
    tags: ["Next.js", "Authentication", "Help Needed"],
    timestamp: "4 hours ago",
    likes: 45,
    comments: 12,
    shares: 3,
  },
  {
    id: 3,
    type: "blog",
    author: {
      name: "Maria Garcia",
      username: "@mariadesign",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "The Future of UI Design: Trends to Watch",
    content:
      "Design is constantly evolving, and 2024 brings exciting new trends that will shape how we create digital experiences. From AI-assisted design to micro-interactions, here's what's coming next...",
    video: true,
    tags: ["Design", "UI/UX", "Trends"],
    timestamp: "1 day ago",
    likes: 89,
    comments: 24,
    shares: 15,
  },
]

const mockComments = [
  {
    id: 1,
    postId: 1,
    author: {
      name: "John Doe",
      username: "@johndoe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "Great article! The section on component composition really helped me understand how to structure my components better.",
    timestamp: "1 hour ago",
    likes: 5,
  },
  {
    id: 2,
    postId: 1,
    author: {
      name: "Emma Wilson",
      username: "@emmawilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content: "Thanks for sharing this. Do you have any recommendations for state management libraries beyond Redux?",
    timestamp: "30 minutes ago",
    likes: 2,
  },
]

export default function BloggingPlatform() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [postType, setPostType] = useState("blog")
  const [showComments, setShowComments] = useState(null)
  const [newComment, setNewComment] = useState("")

  const handleCreatePost = () => {
    setIsCreatePostOpen(false)
  }

  const toggleComments = (postId) => {
    setShowComments(showComments === postId ? null : postId)
  }

  const handleAddComment = (postId) => {
    if (newComment.trim()) {
      setNewComment("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">BlogSpace</h1>
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search posts, topics, or users..." className="pl-10 w-80" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="post-type">Post Type</Label>
                      <Select value={postType} onValueChange={setPostType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select post type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog">Blog Post</SelectItem>
                          <SelectItem value="question">Question/Doubt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder={postType === "blog" ? "Enter your blog post title..." : "What's your question?"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder={
                          postType === "blog"
                            ? "Write your blog post content..."
                            : "Describe your question in detail..."
                        }
                        className="min-h-[200px]"
                      />
                    </div>
                    <div>
                      <Label>Media</Label>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Add Image
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="w-4 h-4 mr-2" />
                          Add Video
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input id="tags" placeholder="Add tags separated by commas..." />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePost} className="bg-blue-600 hover:bg-blue-700">
                        Publish Post
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {mockPosts.map((post) => (
            <Card key={post.id} className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                        <span className="text-gray-500 text-sm">{post.author.username}</span>
                        <Badge variant={post.type === "blog" ? "default" : "secondary"} className="text-xs">
                          {post.type === "blog" ? "Blog" : "Question"}
                        </Badge>
                      </div>
                      <p className="text-gray-500 text-sm">{post.timestamp}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-700 leading-relaxed">{post.content}</p>
                </div>

                {post.image && (
                  <div className="rounded-lg overflow-hidden">
                    <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-64 object-cover" />
                  </div>
                )}

                {post.video && (
                  <div className="rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Video content</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-blue-500"
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                      <Share2 className="w-4 h-4 mr-1" />
                      {post.shares}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-yellow-500">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>

                {showComments === post.id && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleAddComment(post.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {mockComments
                        .filter((comment) => comment.postId === post.id)
                        .map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-sm">{comment.author.name}</span>
                                  <span className="text-gray-500 text-xs">{comment.author.username}</span>
                                  <span className="text-gray-500 text-xs">•</span>
                                  <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                                </div>
                                <p className="text-gray-700 text-sm">{comment.content}</p>
                              </div>
                              <div className="flex items-center space-x-4 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-blue-500 h-6 px-2"
                                >
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  {comment.likes}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-red-500 h-6 px-2"
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-blue-500 h-6 px-2"
                                >
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
