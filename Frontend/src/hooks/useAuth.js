import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkAuthStatus, getUserRole } from '@/lib/auth'

export const useAuthProtection = (requiredRole = null) => {
  const navigate = useNavigate()

  useEffect(() => {
    const isAuthenticated = checkAuthStatus()
    
    if (!isAuthenticated) {
      // Redirect to appropriate login page
      navigate('/user/login')
      return
    }

    if (requiredRole) {
      const userRole = getUserRole()
      
      if (userRole !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        if (userRole === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/user/dashboard')
        }
        return
      }
    }
  }, [navigate, requiredRole])
}

export const useRoleRedirect = () => {
  const navigate = useNavigate()

  const redirectToDashboard = () => {
    const userRole = getUserRole()
    
    if (userRole === 'admin') {
      navigate('/admin/dashboard')
    } else if (userRole === 'user') {
      navigate('/user/dashboard')
    } else {
      navigate('/user/login')
    }
  }

  return redirectToDashboard
}