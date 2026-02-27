import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Carregando...</span>
      </div>
    )
  }
  //proteger as rotas
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
