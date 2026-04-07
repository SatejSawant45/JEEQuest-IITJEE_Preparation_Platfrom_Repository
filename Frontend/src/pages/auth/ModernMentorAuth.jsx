import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/Toast'

export default function ModernMentorAuth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const isLogin = location.pathname === '/mentor/login'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    const role = localStorage.getItem('role')

    if (token && role === 'mentor') {
      navigate('/mentor/dashboard', { replace: true })
    }
  }, [navigate])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return false
    }

    if (!isLogin) {
      if (!formData.name) {
        setError('Name is required')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long')
        return false
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')

    const url = isLogin
      ? `${primaryBackendUrl}/api/mentor/login`
      : `${primaryBackendUrl}/api/mentor/register`

    const submitData = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'mentor'
        }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const responseData = await response.json()

      if (response.ok) {
        const successMessage = isLogin ? 'Welcome back, Mentor!' : 'Mentor account created successfully!'
        setSuccess(successMessage)
        toast.success(successMessage, 'You will be redirected to your mentor dashboard.')

        localStorage.setItem('jwtToken', responseData.token)
        localStorage.setItem('id', responseData.id)
        localStorage.setItem('name', responseData.name)
        localStorage.setItem('email', responseData.email)
        localStorage.setItem('role', 'mentor')

        setTimeout(() => {
          navigate('/mentor/dashboard')
        }, 1200)
      } else {
        setError(responseData.message || 'Authentication failed')
        toast.error('Authentication failed', responseData.message || 'Please check your credentials and try again.')
      }
    } catch (error) {
      console.error('Mentor auth error:', error)
      setError('Network error. Please try again.')
      toast.error('Connection error', 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            {isLogin ? 'Mentor Portal' : 'Mentor Registration'}
          </h1>
          <p className="text-emerald-100 mt-2">
            {isLogin ? 'Access your student communication dashboard' : 'Create your mentor account'}
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              {isLogin ? 'Mentor Login' : 'Mentor Sign Up'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isLogin ? 'Sign in to continue mentoring' : 'Fill in details to create mentor account'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your mentor email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                disabled={loading}
              >
                {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Mentor Sign In' : 'Create Mentor Account')}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              {isLogin ? 'Need a mentor account? ' : 'Already have a mentor account? '}
              <Link to={isLogin ? '/mentor/signup' : '/mentor/login'} className="text-emerald-700 hover:text-emerald-800 font-medium">
                {isLogin ? 'Register here' : 'Sign in here'}
              </Link>
            </div>

            <div className="text-center text-xs text-gray-600 space-y-1">
              <p><Link to="/user/login" className="hover:text-gray-900">Student login</Link></p>
              <p><Link to="/admin/login" className="hover:text-gray-900">Admin login</Link></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
