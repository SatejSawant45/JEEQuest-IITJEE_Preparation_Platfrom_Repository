import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Briefcase, MapPin, Calendar } from 'lucide-react'

export default function AdminProfile() {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    location: '',
    experience: '',
    probableActiveTime: '',
    description: '',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    avatar: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken')
        const response = await fetch(`${primaryBackendUrl}/api/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          localStorage.setItem('avatar', data.avatar || '')
          localStorage.setItem('profilePicture', data.avatar || '')
          setFormData({
            name: data.name || '',
            title: data.title || '',
            company: data.company || '',
            location: data.location || '',
            experience: data.experience || '',
            probableActiveTime: data.probableActiveTime || '',
            description: data.description || '',
            phone: data.phone || '',
            website: data.website || '',
            linkedin: data.linkedin || '',
            github: data.github || '',
            avatar: data.avatar || '',
          })
        }
      } catch (error) {
        console.error('Failed to load admin profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [primaryBackendUrl])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB.')
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      alert('Please select an image first.')
      return
    }

    try {
      setUploadingAvatar(true)
      const token = localStorage.getItem('jwtToken')
      const uploadData = new FormData()
      uploadData.append('avatar', avatarFile)

      const response = await fetch(`${primaryBackendUrl}/api/admin/profile/upload-avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload avatar')
      }

      const avatarUrl = data.avatar || ''
      setFormData((prev) => ({ ...prev, avatar: avatarUrl }))
      if (data.admin) {
        setProfile(data.admin)
      }
      setAvatarFile(null)
      setAvatarPreview('')

      localStorage.setItem('avatar', avatarUrl)
      localStorage.setItem('profilePicture', avatarUrl)

      alert('Profile image uploaded successfully')
    } catch (error) {
      console.error('Failed to upload admin avatar:', error)
      alert(error.message || 'Failed to upload image')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(`${primaryBackendUrl}/api/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      setProfile(data.admin)
      setIsEditing(false)
      localStorage.setItem('name', data.admin.name || '')
      localStorage.setItem('email', data.admin.email || '')
      localStorage.setItem('avatar', data.admin.avatar || '')
      localStorage.setItem('profilePicture', data.admin.avatar || '')
      alert('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update admin profile:', error)
      alert(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleEditStart = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        company: profile.company || '',
        location: profile.location || '',
        experience: profile.experience || '',
        probableActiveTime: profile.probableActiveTime || '',
        description: profile.description || '',
        phone: profile.phone || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        avatar: profile.avatar || '',
      })
    }
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        company: profile.company || '',
        location: profile.location || '',
        experience: profile.experience || '',
        probableActiveTime: profile.probableActiveTime || '',
        description: profile.description || '',
        phone: profile.phone || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        avatar: profile.avatar || '',
      })
    }
    setIsEditing(false)
  }

  const displayName = profile?.name || formData.name || localStorage.getItem('name') || 'Admin'
  const displayEmail = profile?.email || localStorage.getItem('email') || 'admin@example.com'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <Avatar className="h-24 w-24 border-2 border-indigo-200">
                <AvatarImage src={formData.avatar || '/placeholder.svg'} alt={displayName} />
                <AvatarFallback className="text-2xl">
                  {displayName
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                <p className="text-gray-600 mt-1">{formData.title || 'Admin'}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Admin</Badge>
                  {formData.company && <Badge variant="outline">{formData.company}</Badge>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {!isEditing ? (
              <Button onClick={handleEditStart} className="bg-gray-900 hover:bg-gray-800 text-white">
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving || loading} className="bg-gray-900 hover:bg-gray-800 text-white">
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {isEditing ? (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <Label className="mb-3 block">Profile Image (S3 Upload)</Label>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <Avatar className="h-16 w-16 border border-indigo-200">
                        <AvatarImage src={avatarPreview || formData.avatar || '/placeholder.svg'} alt={displayName} />
                        <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Input type="file" accept="image/*" onChange={handleAvatarFileChange} />
                        <p className="text-xs text-gray-500">Max 5MB. Uploaded to S3.</p>
                      </div>
                      <Button
                        type="button"
                        onClick={handleUploadAvatar}
                        disabled={uploadingAvatar || !avatarFile}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        {uploadingAvatar ? 'Uploading...' : 'Upload Image'}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input value={formData.title} onChange={(e) => handleChange('title', e.target.value)} />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input value={formData.company} onChange={(e) => handleChange('company', e.target.value)} />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={formData.location} onChange={(e) => handleChange('location', e.target.value)} />
                    </div>
                    <div>
                      <Label>Experience</Label>
                      <Input value={formData.experience} onChange={(e) => handleChange('experience', e.target.value)} />
                    </div>
                    <div>
                      <Label>Likely Active Time</Label>
                      <Input
                        value={formData.probableActiveTime}
                        onChange={(e) => handleChange('probableActiveTime', e.target.value)}
                        placeholder="e.g. Weekdays 7 PM - 10 PM"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input value={formData.website} onChange={(e) => handleChange('website', e.target.value)} />
                    </div>
                    <div>
                      <Label>LinkedIn</Label>
                      <Input value={formData.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} />
                    </div>
                    <div>
                      <Label>GitHub</Label>
                      <Input value={formData.github} onChange={(e) => handleChange('github', e.target.value)} />
                    </div>
                    <div>
                      <Label>Avatar URL</Label>
                      <Input value={formData.avatar} onChange={(e) => handleChange('avatar', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <p className="text-gray-500 mb-1">Name</p>
                      <p className="font-medium text-gray-900">{displayName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Title</p>
                      <p className="font-medium text-gray-900">{formData.title || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Company</p>
                      <p className="font-medium text-gray-900">{formData.company || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Location</p>
                      <p className="font-medium text-gray-900">{formData.location || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Experience</p>
                      <p className="font-medium text-gray-900">{formData.experience || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Likely Active Time</p>
                      <p className="font-medium text-gray-900">{formData.probableActiveTime || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Phone</p>
                      <p className="font-medium text-gray-900">{formData.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Website</p>
                      <p className="font-medium text-gray-900">{formData.website || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">LinkedIn</p>
                      <p className="font-medium text-gray-900">{formData.linkedin || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">GitHub</p>
                      <p className="font-medium text-gray-900">{formData.github || 'Not set'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-1 text-sm">Description</p>
                    <p className="text-gray-900 text-sm whitespace-pre-wrap">{formData.description || 'No description provided yet.'}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{displayEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span>{formData.company || 'No company set'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{formData.location || 'No location set'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formData.probableActiveTime || 'No active time set'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
