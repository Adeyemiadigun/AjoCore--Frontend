import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { auth as authApi } from '@/api/endpoints'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/api'
import { UserRole } from '@/types/enums'

interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<string>
  adminLogin: (data: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function mapResponse(response: AuthResponse): User {
  return {
    id: response.userId,
    email: response.email,
    fullName: response.fullName,
    role: response.role as UserRole,
  }
}

function persistAuth(response: AuthResponse) {
  localStorage.setItem('ajocore_token', response.token)
  localStorage.setItem('ajocore_refresh_token', response.refreshToken)
  localStorage.setItem('ajocore_user', JSON.stringify(mapResponse(response)))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('ajocore_token')
    const storedUser = localStorage.getItem('ajocore_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser) as User)
      } catch {
        localStorage.clear()
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authApi.login(data)
    persistAuth(response)
    setToken(response.token)
    setUser(mapResponse(response))
  }, [])

  const register = useCallback(async (data: RegisterRequest): Promise<string> => {
    const message = await authApi.register(data)
    return message
  }, [])

  const adminLogin = useCallback(async (data: LoginRequest) => {
    const response = await authApi.adminLogin(data)
    persistAuth(response)
    setToken(response.token)
    setUser(mapResponse(response))
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ajocore_token')
    localStorage.removeItem('ajocore_refresh_token')
    localStorage.removeItem('ajocore_user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
