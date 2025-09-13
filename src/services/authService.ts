import { z } from 'zod'
import { ApiClient } from './api'
import { apiRoutes } from '../utils/routes/apiRoutes'
import { type AuthResponse, type AuthCredentials } from 'types'

const api = new ApiClient()

const AuthResponseSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export const authenticate = async (credentials: AuthCredentials): Promise<boolean> => {
  try {
    const url = apiRoutes.auth
    const response = await api.get<AuthResponse>({
      url,
      responseSchema: AuthResponseSchema,
    })

    return credentials.username === response.username && credentials.password === response.password
  } catch (error) {
    console.error('Authentication failed:', error)
    return false
  }
}

export const getAuthConfig = async (): Promise<AuthResponse> => {
  const url = apiRoutes.auth
  return api.get<AuthResponse>({
    url,
    responseSchema: AuthResponseSchema,
  })
}

export class AuthService {
  async authenticate(credentials: AuthCredentials): Promise<boolean> {
    return authenticate(credentials)
  }

  async getAuthConfig(): Promise<AuthResponse> {
    return getAuthConfig()
  }

  validateToken(token: string): boolean {
    return token === 'mock-jwt-token'
  }

  getStoredAuthData(): { token: string | null; userData: any | null } {
    const token = localStorage.getItem('authToken')
    const userDataStr = localStorage.getItem('userData')

    let userData = null
    if (userDataStr) {
      try {
        userData = JSON.parse(userDataStr)
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        localStorage.removeItem('userData')
      }
    }

    return { token, userData }
  }

  storeAuthData(token: string, userData: any): void {
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  clearAuthData(): void {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  }
}

export const authService = new AuthService()
