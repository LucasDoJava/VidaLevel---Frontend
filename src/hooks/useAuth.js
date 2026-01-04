import { useState, useEffect, createContext, useContext } from 'react'
import { toast } from 'react-hot-toast'

// import { api } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('auth_user')

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setIsLoading(true)

      // 🔹 LOGIN MOCKADO (SEM API)
      if (credentials.email && credentials.password) {
        const fakeUser = {
          id: 1,
          name: 'Usuário Demo',
          email: credentials.email
        }

        setUser(fakeUser)
        localStorage.setItem('auth_user', JSON.stringify(fakeUser))

        toast.success('Login realizado com sucesso!')
        return true
      }

      toast.error('Email ou senha inválidos')
      return false
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Erro interno')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setIsLoading(true)

      if (userData.password !== userData.confirmPassword) {
        toast.error('As senhas não coincidem')
        return false
      }

      // 🔹 REGISTRO MOCKADO
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email
      }

      setUser(newUser)
      localStorage.setItem('auth_user', JSON.stringify(newUser))

      toast.success('Conta criada com sucesso!')
      return true
    } catch (error) {
      console.error('Erro no registro:', error)
      toast.error('Erro interno')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    setUser(null)
    toast.success('Logout realizado com sucesso!')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context
}
