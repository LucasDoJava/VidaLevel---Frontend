import { useEffect } from 'react'
import {
  Calendar,
  Award,
  Trophy
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useUserStats } from '../hooks/useUserStats'

export default function Estatisticas() {
  const {
    stats,
    isLoading,
    getAchievements
  } = useUserStats()

  useEffect(() => {
    document.title = 'Estatísticas - VidaLevel'
  }, [])

  if (isLoading || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600">Carregando estatísticas...</p>
      </div>
    )
  }

  const achievements = getAchievements()

  // ===== ATIVIDADE MOCKADA =====
  const dailyActivity = [
    { date: '01/12', completions: 3 },
    { date: '02/12', completions: 1 },
    { date: '03/12', completions: 4 },
    { date: '04/12', completions: 2 },
    { date: '05/12', completions: 5 }
  ]

  const maxCompletions = Math.max(
    ...dailyActivity.map(d => d.completions),
    1
  )
  // ============================================

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Estatísticas e Progresso
        </h1>
        <p className="text-gray-600">
          Acompanhe sua evolução ao longo do tempo
        </p>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nível</p>
              <p className="text-3xl font-bold">{stats.level}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Pontos</p>
          <p className="text-3xl font-bold">{stats.totalPoints}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Maior Sequência</p>
          <p className="text-3xl font-bold">
            {stats.longestStreak} dias
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Hábitos Concluídos</p>
          <p className="text-3xl font-bold">
            {stats.totalHabitsCompleted}
          </p>
        </div>

      </div>

      {/* Atividade recente */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Últimos Dias
        </h2>

        <div className="space-y-3">
          {dailyActivity.map(day => (
            <div key={day.date} className="flex items-center gap-3">
              <span className="w-12 text-sm text-gray-600">
                {day.date}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{
                    width: `${(day.completions / maxCompletions) * 100}%`
                  }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {day.completions}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Conquistas */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Conquistas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map(a => (
            <motion.div
              key={a.id}
              whileHover={{ scale: 1.03 }}
              className={`p-4 rounded-lg border ${
                a.unlocked
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-2xl mb-2">{a.icon}</div>
              <h3 className="font-semibold">{a.name}</h3>
              <p className="text-sm text-gray-600">
                {a.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  )
}
