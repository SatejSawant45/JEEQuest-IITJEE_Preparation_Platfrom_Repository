import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { checkAuthStatus, getUserRole } from '@/lib/auth'
import { FullPageLoader } from './LoadingSpinner'

const ProtectedRoute = ({ children, requiredRole = null, fallback = '/user/login' }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = checkAuthStatus()
      
      if (!isAuthenticated) {
        setIsAuthorized(false)
        setIsLoading(false)
        return
      }

      if (requiredRole) {
        const userRole = getUserRole()
        setIsAuthorized(userRole === requiredRole)
      } else {
        setIsAuthorized(true)
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [requiredRole])

  if (isLoading) {
    return <FullPageLoader message="Verifying authentication..." />
  }

  if (!isAuthorized) {
    return <Navigate to={fallback} replace />
  }

  return children
}

export default ProtectedRoute