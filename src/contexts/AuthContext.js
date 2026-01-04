import { createContext, useContext, useState } from 'react'
import { toast } from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = !!user

  const login = async () => {
    setIsLoading(true)

    // 🔴 MOCK LOGIN
    setTimeout(() => {
      setUser({
        name: 'Usuário Demo',
        email: 'demo@email.com'
      })
      toast.success('Login realizado com sucesso!')
      setIsLoading(false)
    }, 1000)

    return true
  }

  const register = async () => {
    toast.success('Conta criada com sucesso!')
    return true
  }

  const logout = () => {
    setUser(null)
    toast.success('Logout realizado')
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider')
  }
  return context
}
