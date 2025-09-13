import { useState, useEffect } from 'react'
import { authService } from 'services'
import { type AuthUser, type AuthContextType } from 'types'

export const useAuth = (): AuthContextType => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const { token, userData } = authService.getStoredAuthData()

      if (token && userData && authService.validateToken(token)) {
        setUser(userData)
        setIsAuthenticated(true)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const isAuthenticated = await authService.authenticate({ username, password })

      if (isAuthenticated) {
        const user: AuthUser = {
          id: '1',
          username: username,
          email: `${username}@example.com`,
        }

        authService.storeAuthData('mock-jwt-token', user)

        setUser(user)
        setIsAuthenticated(true)
        setIsLoading(false)
        return true
      }

      setError('Invalid username or password')
      setIsLoading(false)
      return false
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    authService.clearAuthData()
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    error,
  }
}
