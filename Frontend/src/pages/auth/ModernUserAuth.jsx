import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/Toast"

export default function ModernUserAuth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const isLogin = location.pathname === '/user/login'
  
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

  // Redirect if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    const role = localStorage.getItem('role')
    
    if (token && role === 'user') {
      navigate('/user/dashboard', { replace: true })
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
      ? `${primaryBackendUrl}/api/auth/login` 
      : `${primaryBackendUrl}/api/auth/register`

    const submitData = isLogin 
      ? { email: formData.email, password: formData.password }
      : { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password,
          role: 'user'
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
        const successMessage = isLogin ? 'Welcome back!' : 'Account created successfully!'
        toast.success(successMessage, 'You will be redirected to your dashboard.')
        
        // Store user data
        localStorage.setItem('jwtToken', responseData.token)
        localStorage.setItem('id', responseData.id)
        localStorage.setItem('name', responseData.name)
        localStorage.setItem('email', responseData.email)
        localStorage.setItem('role', 'user')

        // Redirect after short delay
        setTimeout(() => {
          navigate('/user/dashboard')
        }, 1500)
      } else {
        setError(responseData.message || 'Authentication failed')
        toast.error('Authentication failed', responseData.message || 'Please check your credentials and try again.')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError('Network error. Please try again.')
      toast.error('Connection error', 'Unable to connect to the server. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin 
              ? 'Sign in to your student account' 
              : 'Join our quiz platform today'
            }
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              {isLogin ? 'Student Login' : 'Student Registration'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Enter your credentials to access your dashboard'
                : 'Fill in your details to create your account'
              }
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
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
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
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
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
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link 
                to={isLogin ? '/user/signup' : '/user/login'} 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="text-center">
              <Link 
                to="/admin/login" 
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Are you an admin? <span className="text-blue-600 font-medium">Login here</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}