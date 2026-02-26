import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  Save,
  ArrowLeft,
  Plus,
  X,
  Link,
  Github,
  Linkedin,
  Globe,
  Camera,
  Upload
} from "lucide-react"

export default function EditProfile() {
  const navigate = useNavigate()
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    university: '',
    course: '',
    year: '',
    gpa: '',
    graduationYear: '',
    about: '',
    skills: [],
    interests: [],
    profilePicture: '',
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: ''
    }
  })

  const [newSkill, setNewSkill] = useState('')
  const [newInterest, setNewInterest] = useState('')

  // Load user profile data
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("jwtToken")
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${primaryBackendUrl}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const user = await response.json()
      
      // Set form data with user data
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        university: user.university || '',
        course: user.course || '',
        year: user.year || '',
        gpa: user.gpa || '',
        graduationYear: user.graduationYear || '',
        about: user.about || '',
        skills: user.skills || [],
        interests: user.interests || [],
        profilePicture: user.profilePicture || '',
        socialLinks: {
          linkedin: user.socialLinks?.linkedin || '',
          github: user.socialLinks?.github || '',
          portfolio: user.socialLinks?.portfolio || ''
        }
      })
      
      setError(null)
    } catch (err) {
      console.error('Error loading profile:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }))
      setNewInterest('')
    }
  }

  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }))
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG, PNG, etc.)')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      
      setSelectedFile(file)
      setError(null)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      const token = localStorage.getItem("jwtToken")
      
      const formData = new FormData()
      formData.append('profilePicture', selectedFile)

      const response = await fetch(`${primaryBackendUrl}/api/auth/profile/upload-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        // Update the form data with the new profile picture URL
        // S3 URLs are already complete, local URLs need backend URL prefix
        const profilePictureUrl = data.profilePicture.startsWith('http') 
          ? data.profilePicture 
          : `${primaryBackendUrl}${data.profilePicture}`;
          
        setFormData(prev => ({
          ...prev,
          profilePicture: profilePictureUrl
        }))
        
        // Update localStorage so navbar shows new profile picture immediately
        localStorage.setItem('profilePicture', data.profilePicture)
        
        setSelectedFile(null)
        setPreviewUrl(null)
        setError(null)
        
        // Show success message and reload profile data
        alert('Profile picture uploaded successfully!')
        
        // Reload the user profile data to get updated info
        await loadProfile()
        
        // Force page reload to update navbar
        window.location.reload()
      } else {
        throw new Error(data.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      const token = localStorage.getItem("jwtToken")
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${primaryBackendUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      const result = await response.json()
      console.log('Profile updated successfully:', result)
      
      // Navigate back to profile page
      navigate('/user/dashboard/profile')
      
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <User className="w-12 h-12 mx-auto mb-2" />
              <p className="font-semibold">Failed to Load Profile</p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadProfile}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/user/dashboard/profile')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, State/Country"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Profile Picture</Label>
                    <div className="flex flex-col gap-4">
                      {/* Current/Preview Image */}
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage 
                            src={previewUrl || formData.profilePicture} 
                            alt="Profile Preview"
                          />
                          <AvatarFallback className="bg-gray-100">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Choose a profile picture (JPEG, PNG, max 5MB)
                          </p>
                        </div>
                      </div>

                      {/* File Upload */}
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={!selectedFile || uploading}
                          variant="outline"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                      </div>

                      {/* Alternative: URL Input */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or paste image URL
                          </span>
                        </div>
                      </div>
                      
                      <Input
                        placeholder="https://example.com/your-photo.jpg"
                        value={formData.profilePicture}
                        onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="university">University/Institution</Label>
                      <Input
                        id="university"
                        value={formData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        placeholder="Your university name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="course">Course/Major</Label>
                      <Input
                        id="course"
                        value={formData.course}
                        onChange={(e) => handleInputChange('course', e.target.value)}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="year">Current Year</Label>
                      <Input
                        id="year"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        placeholder="e.g., Junior Year"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gpa">GPA</Label>
                      <Input
                        id="gpa"
                        value={formData.gpa}
                        onChange={(e) => handleInputChange('gpa', e.target.value)}
                        placeholder="e.g., 3.8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        value={formData.graduationYear}
                        onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                        placeholder="e.g., 2025"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="about">Tell us about yourself</Label>
                    <Textarea
                      id="about"
                      value={formData.about}
                      onChange={(e) => handleInputChange('about', e.target.value)}
                      placeholder="Write a brief description about yourself, your interests, and goals..."
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.about.length}/500 characters
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5" />
                    Social Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      GitHub Profile
                    </Label>
                    <Input
                      id="github"
                      value={formData.socialLinks.github}
                      onChange={(e) => handleInputChange('socialLinks.github', e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio" className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Portfolio Website
                    </Label>
                    <Input
                      id="portfolio"
                      value={formData.socialLinks.portfolio}
                      onChange={(e) => handleInputChange('socialLinks.portfolio', e.target.value)}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Skills & Interests */}
            <div className="space-y-6">
              {/* Profile Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Preview</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={formData.profilePicture} alt={formData.name} />
                    <AvatarFallback className="text-lg">
                      {formData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{formData.name || 'Your Name'}</h3>
                  <p className="text-muted-foreground">
                    {formData.course ? `${formData.course} Student` : 'Student'}
                  </p>
                  {formData.university && (
                    <p className="text-sm text-muted-foreground mt-1">{formData.university}</p>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    />
                    <Button type="button" onClick={addInterest} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="flex items-center gap-1">
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                  {error && (
                    <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}