import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MentorSidebar from '@/components/MentorSidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Briefcase, MapPin, Calendar } from 'lucide-react'

export default function MentorProfile() {
  const [profile, setProfile] = useState(null)
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

  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken')
        const response = await fetch(`${primaryBackendUrl}/api/mentor/profile`, {
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
        console.error('Failed to load mentor profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [primaryBackendUrl])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(`${primaryBackendUrl}/api/mentor/profile`, {
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

      setProfile(data.mentor)
      localStorage.setItem('name', data.mentor.name || '')
      localStorage.setItem('email', data.mentor.email || '')
      localStorage.setItem('avatar', data.mentor.avatar || '')
      localStorage.setItem('profilePicture', data.mentor.avatar || '')
      alert('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update mentor profile:', error)
      alert(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const displayName = profile?.name || formData.name || localStorage.getItem('name') || 'Mentor'
  const displayEmail = profile?.email || localStorage.getItem('email') || 'mentor@example.com'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MentorSidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <Avatar className="h-24 w-24 border-2 border-emerald-200">
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
                <p className="text-gray-600 mt-1">{formData.title || 'Mentor'}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Mentor</Badge>
                  {formData.company && <Badge variant="outline">{formData.company}</Badge>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="#edit-profile"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Edit Profile
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2" id="edit-profile">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      placeholder="e.g. Weekdays 6 PM - 10 PM"
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

                <Button onClick={handleSave} disabled={saving || loading} className="bg-gray-900 hover:bg-gray-800 text-white">
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>

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
