export interface User {
  id: string
  username: string
  email: string
}

export interface AuthCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  username: string
  password: string
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  error: string | null
}

export interface LoginFormData {
  username: string
  password: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  error: string | null
}
