import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import MyHabits from './pages/TelaPrincipal'
import AddHabitPage from './pages/AddHabitos'
import StatsPage from './pages/Estatisticas'
import Login from './pages/TelaLogin'
import Ranking from "./pages/Ranking"

import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import { useAuth } from './contexts/AuthContext'

function Layout({ children }) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {isAuthenticated && <Navbar />}
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>

            {/* 🔓 ROTA PÚBLICA */}
            <Route path="/login" element={<Login />} />

            {/* ✅ ROTA PRINCIPAL: MEUS HÁBITOS */}
            <Route
              path="/habits"
              element={
                <PrivateRoute>
                  <MyHabits />
                </PrivateRoute>
              }
            />

            {/* 🔁 REDIRECIONA / PARA /habits */}
            <Route path="/" element={<Navigate to="/habits" replace />} />

            {/* 🔒 ROTAS PROTEGIDAS */}
            <Route
              path="/add-habit"
              element={
                <PrivateRoute>
                  <AddHabitPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/estatisticas"
              element={
                <PrivateRoute>
                  <StatsPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/ranking"
              element={
                <PrivateRoute>
                  <Ranking />
                </PrivateRoute>
              }
            />

            {/* 🔁 QUALQUER OUTRA ROTA */}
            <Route path="*" element={<Navigate to="/habits" replace />} />

          </Routes>
        </Layout>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
      </Router>
    </AuthProvider>
  )
}
