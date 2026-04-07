import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Shield, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/Toast"

export default function ModernAdminAuth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const isLogin = location.pathname === '/admin/login'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL

  // Redirect if admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    const role = localStorage.getItem('role')
    
    if (token && role === 'admin') {
      navigate('/admin/dashboard', { replace: true })
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
      if (!formData.secretKey) {
        setError('Admin secret key is required')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
      if (formData.password.length < 8) {
        setError('Admin password must be at least 8 characters long')
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
      ? `${primaryBackendUrl}/api/admin/login` 
      : `${primaryBackendUrl}/api/admin/register`

    const submitData = isLogin 
      ? { email: formData.email, password: formData.password }
      : { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password,
          secretKey: formData.secretKey,
          role: 'admin'
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
      console.log('📥 Login response:', responseData)

      if (response.ok) {
        const successMessage = isLogin ? 'Welcome back, Admin!' : 'Admin account created successfully!'
        toast.success(successMessage, 'You will be redirected to the admin dashboard.')
        
        // Store admin data
        console.log('💾 Storing token:', responseData.token)
        localStorage.setItem('jwtToken', responseData.token)
        localStorage.setItem('id', responseData.id)
        localStorage.setItem('name', responseData.name)
        localStorage.setItem('email', responseData.email)
        localStorage.setItem('role', 'admin')

        console.log('✅ Token stored. Checking:', localStorage.getItem('jwtToken'))

        // Redirect after short delay
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1500)
      } else {
        setError(responseData.message || 'Authentication failed')
        toast.error('Authentication failed', responseData.message || 'Please check your credentials and try again.')
      }
    } catch (error) {
      console.error('Admin auth error:', error)
      setError('Network error. Please try again.')
      toast.error('Connection error', 'Unable to connect to the server. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            {isLogin ? 'Admin Portal' : 'Admin Registration'}
          </h1>
          <p className="text-purple-200 mt-2">
            {isLogin 
              ? 'Secure access to administrative controls' 
              : 'Create your administrative account'
            }
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              {isLogin ? 'Administrator Login' : 'Administrator Registration'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isLogin 
                ? 'Enter your admin credentials to continue'
                : 'Fill in your details to create an admin account'
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
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                    placeholder="Enter your admin email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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

                  <div className="space-y-2">
                    <Label htmlFor="secretKey" className="text-gray-700">Admin Secret Key</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="secretKey"
                        name="secretKey"
                        type="password"
                        placeholder="Enter admin secret key"
                        value={formData.secretKey}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Contact system administrator for the secret key</p>
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  isLogin ? 'Admin Sign In' : 'Create Admin Account'
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              {isLogin ? "Need an admin account? " : "Already have an admin account? "}
              <Link 
                to={isLogin ? '/admin/signup' : '/admin/login'} 
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                {isLogin ? 'Register here' : 'Sign in here'}
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <div className="text-center">
              <Link 
                to="/user/login" 
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Are you a student? <span className="text-purple-600 font-medium">Login here</span>
              </Link>
            </div>

            <div className="text-center">
              <Link
                to="/mentor/login"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Are you a mentor? <span className="text-purple-600 font-medium">Login here</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-purple-200 text-xs">
            🔒 Secure admin portal with encrypted connections
          </p>
        </div>
      </div>
    </div>
  )
}