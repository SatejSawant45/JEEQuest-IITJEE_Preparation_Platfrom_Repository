"use client"

import { useState, useEffect } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Upload,
  X,
} from "lucide-react"

export default function BloggingPlatform() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [postType, setPostType] = useState("blog")
  const [showComments, setShowComments] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  // Blog data states
  const [allBlogs, setAllBlogs] = useState([])
  const [myBlogs, setMyBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)
  
  // Current user profile state
  const [currentUser, setCurrentUser] = useState(null)
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'blog',
    tags: '',
    images: [],
    video: ''
  })
  
  // Image upload states
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState([])
  
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL

  // Helper function to get full profile picture URL
  const getProfilePictureUrl = (profilePicture) => {
    if (!profilePicture) return "/placeholder.svg"
    if (profilePicture.startsWith('http')) return profilePicture
    return `${primaryBackendUrl}${profilePicture}`
  }

  // Helper function to fix and return correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return ""
    
    // Fix malformed URLs that have localhost prepended to S3 URLs
    if (imageUrl.includes('http://localhost') && imageUrl.includes('https://')) {
      // Extract the S3 URL part
      const s3UrlMatch = imageUrl.match(/(https:\/\/[^"'\s]+)/)
      if (s3UrlMatch) {
        return s3UrlMatch[1]
      }
    }
    
    // Fix malformed URLs with any backend URL prepended to S3 URLs
    if (imageUrl.match(/https?:\/\/[^/]+https?:\/\//)) {
      // Extract the second URL (the S3 URL)
      const match = imageUrl.match(/(https?:\/\/[^/]+)(https?:\/\/.+)/)
      if (match && match[2]) {
        return match[2]
      }
    }
    
    // If already absolute URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    
    // If relative URL, prepend backend URL
    return `${primaryBackendUrl}${imageUrl}`
  }

  // Load current user profile
  const loadCurrentUser = async () => {
    try {
      const token = localStorage.getItem("jwtToken")
      if (!token) return

      const response = await fetch(`${primaryBackendUrl}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const user = await response.json()
        setCurrentUser(user)
      }
    } catch (error) {
      console.error('Error loading current user:', error)
    }
  }

  // Load blogs on component mount
  useEffect(() => {
    loadCurrentUser()
    loadAllBlogs()
    loadMyBlogs()
  }, [])

  const loadAllBlogs = async () => {
    try {
      setLoading(true)
      console.log('Backend URL:', primaryBackendUrl)
      console.log('Fetching from:', `${primaryBackendUrl}/api/blog`)
      
      const response = await fetch(`${primaryBackendUrl}/api/blog`)
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error('Failed to fetch blogs')
      }

      const data = await response.json()
      console.log('Fetched blogs data:', data)
      console.log('Number of blogs:', data.blogs?.length || 0)
      setAllBlogs(data.blogs || [])
    } catch (err) {
      console.error('Error loading all blogs:', err)
      setError('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const loadMyBlogs = async () => {
    try {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        console.log('No JWT token found for my blogs')
        return
      }

      console.log('Fetching my blogs from:', `${primaryBackendUrl}/api/blog/user/my-blogs`)
      const response = await fetch(`${primaryBackendUrl}/api/blog/user/my-blogs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('My blogs response status:', response.status)
      
      if (!response.ok) {
        throw new Error('Failed to fetch my blogs')
      }

      const data = await response.json()
      console.log('Fetched my blogs data:', data)
      console.log('Number of my blogs:', data.blogs?.length || 0)
      setMyBlogs(data.blogs || [])
    } catch (err) {
      console.error('Error loading my blogs:', err)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }

    // Validate files
    for (let file of files) {
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Each image should be less than 10MB')
        return
      }
    }

    setSelectedFiles(files)

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return []

    try {
      setUploading(true)
      const token = localStorage.getItem("jwtToken")
      
      const imageFormData = new FormData()
      selectedFiles.forEach(file => {
        imageFormData.append('images', file)
      })

      const response = await fetch(`${primaryBackendUrl}/api/blog/upload-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: imageFormData
      })

      const data = await response.json()

      if (response.ok) {
        // S3 URLs are already absolute, only prepend backend URL for relative paths
        const fullImageUrls = data.images.map(img => {
          // Check if URL is already absolute (starts with http:// or https://)
          if (img.startsWith('http://') || img.startsWith('https://')) {
            return img
          }
          // Otherwise, it's a relative URL, prepend backend URL
          return `${primaryBackendUrl}${img}`
        })
        return fullImageUrls
      } else {
        throw new Error(data.message || 'Image upload failed')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      alert(error.message || 'Failed to upload images')
      return []
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(previewUrls[index])
    
    setSelectedFiles(newFiles)
    setPreviewUrls(newUrls)
  }

  const handleCreatePost = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in title and content')
      return
    }

    try {
      setCreating(true)
      const token = localStorage.getItem("jwtToken")
      
      if (!token) {
        alert('Please login to create a blog post')
        return
      }

      // Upload images first if any selected
      let imageUrls = []
      if (selectedFiles.length > 0) {
        imageUrls = await handleImageUpload()
      }

      // Prepare blog data with uploaded image URLs
      const blogData = {
        ...formData,
        images: imageUrls
      }

      const response = await fetch(`${primaryBackendUrl}/api/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create blog post')
      }

      const data = await response.json()
      console.log('Blog created successfully:', data)

      // Reset form and close dialog
      setFormData({
        title: '',
        content: '',
        type: 'blog',
        tags: '',
        images: [],
        video: ''
      })
      
      // Reset image upload states
      setSelectedFiles([])
      setPreviewUrls([])
      setIsCreatePostOpen(false)

      // Reload blogs
      await loadAllBlogs()
      await loadMyBlogs()

      alert('Blog post created successfully!')
    } catch (err) {
      console.error('Error creating blog:', err)
      alert(err.message || 'Failed to create blog post')
    } finally {
      setCreating(false)
    }
  }

  const toggleComments = (postId) => {
    setShowComments(showComments === postId ? null : postId)
  }

  const handleLike = async (blogId) => {
    try {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        alert('Please login to like posts')
        return
      }

      const response = await fetch(`${primaryBackendUrl}/api/blog/${blogId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Reload blogs to get updated like count
        loadAllBlogs()
        loadMyBlogs()
      }
    } catch (err) {
      console.error('Error liking blog:', err)
    }
  }

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return

    try {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        alert('Please login to comment')
        return
      }

      const response = await fetch(`${primaryBackendUrl}/api/blog/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      })

      if (response.ok) {
        setNewComment("")
        // Reload blogs to get updated comments
        loadAllBlogs()
        loadMyBlogs()
      }
    } catch (err) {
      console.error('Error adding comment:', err)
    }
  }

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return '1 day ago'
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const getCurrentBlogs = () => {
    const blogs = activeTab === 'all' ? allBlogs : myBlogs
    console.log(`Getting ${activeTab} blogs:`, blogs)
    console.log('All blogs state:', allBlogs)
    console.log('My blogs state:', myBlogs)
    return blogs
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
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
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
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder={formData.type === "blog" ? "Enter your blog post title..." : "What's your question?"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        placeholder={
                          formData.type === "blog"
                            ? "Write your blog post content..."
                            : "Describe your question in detail..."
                        }
                        className="min-h-[200px]"
                      />
                    </div>
                    <div>
                      <Label>Images (optional, max 5)</Label>
                      <div className="space-y-4">
                        {/* File Upload */}
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={selectedFiles.length === 0 || uploading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {selectedFiles.length} selected
                          </Button>
                        </div>

                        {/* Image Previews */}
                        {previewUrls.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {previewUrls.map((url, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-20 object-cover rounded border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-1 right-1 h-6 w-6 p-0"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="video">Video URL (optional)</Label>
                      <Input
                        id="video"
                        value={formData.video}
                        onChange={(e) => handleInputChange('video', e.target.value)}
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input 
                        id="tags" 
                        value={formData.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                        placeholder="Add tags separated by commas..." 
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreatePostOpen(false)} disabled={creating}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePost} className="bg-blue-600 hover:bg-blue-700" disabled={creating}>
                        {creating ? (
                          <>
                            <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Publishing...
                          </>
                        ) : (
                          'Publish Post'
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={getProfilePictureUrl(currentUser?.profilePicture)} />
                <AvatarFallback>
                  {currentUser?.name ? currentUser.name[0].toUpperCase() : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Blogs</TabsTrigger>
            <TabsTrigger value="my">My Blogs</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blogs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => { loadAllBlogs(); loadMyBlogs(); }}>
              Try Again
            </Button>
          </div>
        ) : getCurrentBlogs().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {activeTab === 'my' ? 'You haven\'t created any blog posts yet.' : 'No blog posts available.'}
            </p>
            {activeTab === 'my' && (
              <Button onClick={() => setIsCreatePostOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                Create Your First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {getCurrentBlogs().map((post) => (
            <Card key={post._id} className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={getProfilePictureUrl(post.author.profilePicture)} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                        <span className="text-gray-500 text-sm">@{post.author.email.split('@')[0]}</span>
                        <Badge variant={post.type === "blog" ? "default" : "secondary"} className="text-xs">
                          {post.type === "blog" ? "Blog" : "Question"}
                        </Badge>
                      </div>
                      <p className="text-gray-500 text-sm">{formatTimestamp(post.createdAt)}</p>
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

                {post.images && post.images.length > 0 && (
                  <div className="space-y-2">
                    {post.images.length === 1 ? (
                      <div className="rounded-lg overflow-hidden">
                        <img src={getImageUrl(post.images[0])} alt="Post image" className="w-full h-64 object-cover" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {post.images.slice(0, 4).map((image, index) => (
                          <div key={index} className="rounded-lg overflow-hidden relative">
                            <img src={getImageUrl(image)} alt={`Post image ${index + 1}`} className="w-full h-32 object-cover" />
                            {index === 3 && post.images.length > 4 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white font-semibold">+{post.images.length - 4} more</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {post.video && (
                  <div className="rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Video content</p>
                      <a href={post.video} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Watch Video
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {post.tags && post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => handleLike(post._id)}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-blue-500"
                      onClick={() => toggleComments(post._id)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments ? post.comments.length : 0}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                      <Share2 className="w-4 h-4 mr-1" />
                      {post.shares || 0}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-yellow-500">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>

                {showComments === post._id && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={getProfilePictureUrl(currentUser?.profilePicture)} />
                        <AvatarFallback>
                          {currentUser?.name ? currentUser.name[0].toUpperCase() : <User className="w-4 h-4" />}
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
                            onClick={() => handleAddComment(post._id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {post.comments && post.comments.map((comment) => (
                          <div key={comment._id} className="flex space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={getProfilePictureUrl(comment.author.profilePicture)} />
                              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-sm">{comment.author.name}</span>
                                  <span className="text-gray-500 text-xs">@{comment.author.email.split('@')[0]}</span>
                                  <span className="text-gray-500 text-xs">•</span>
                                  <span className="text-gray-500 text-xs">{formatTimestamp(comment.createdAt)}</span>
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
                                  {comment.likes || 0}
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
        )}
      </main>
    </div>
  )
}
