import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

// ============================
// Conquistas mockadas
// ============================
const ACHIEVEMENTS = [
  {
    id: 'first_habit',
    name: 'Primeiro Passo',
    description: 'Complete seu primeiro hábito',
    icon: '🎯',
    condition: (stats) => stats.totalHabitsCompleted >= 1
  },
  {
    id: 'streak_7',
    name: 'Semana Forte',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '🔥',
    condition: (stats) => stats.longestStreak >= 7
  },
  {
    id: 'level_5',
    name: 'Evoluindo',
    description: 'Alcance o nível 5',
    icon: '⭐',
    condition: (stats) => stats.level >= 5
  },
  {
    id: 'points_1000',
    name: 'Milionário',
    description: 'Acumule 1000 pontos',
    icon: '💎',
    condition: (stats) => stats.totalPoints >= 1000
  },
  {
    id: 'habits_50',
    name: 'Persistente',
    description: 'Complete 50 hábitos',
    icon: '🏆',
    condition: (stats) => stats.totalHabitsCompleted >= 50
  },
  {
    id: 'streak_30',
    name: 'Dedicado',
    description: 'Mantenha uma sequência de 30 dias',
    icon: '👑',
    condition: (stats) => stats.longestStreak >= 30
  }
]

// ============================
// Hook
// ============================
export function useUserStats() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // ============================
  // Mock de carregamento
  // ============================
  const fetchStats = () => {
    setIsLoading(true)
    setError(null)

    // Simula delay de API
    setTimeout(() => {
      setStats({
        level: 3,
        currentExp: 60,
        expToNextLevel: 40,
        totalPoints: 420,
        longestStreak: 12,
        totalHabitsCompleted: 58,
        achievements: ['first_habit', 'streak_7']
      })
      setIsLoading(false)
    }, 500)
  }

  // ============================
  // Conquistas
  // ============================
  const checkAchievements = (currentStats) => {
    if (!currentStats) return

    const unlocked = ACHIEVEMENTS.filter(a =>
      a.condition(currentStats) &&
      !currentStats.achievements.includes(a.id)
    )

    unlocked.forEach(a => {
      toast?.success?.(`🏆 Conquista desbloqueada: ${a.name}!`)
    })

    if (unlocked.length > 0) {
      setStats(prev => ({
        ...prev,
        achievements: [
          ...prev.achievements,
          ...unlocked.map(a => a.id)
        ]
      }))
    }
  }

  const getAchievements = () => {
    if (!stats) return []

    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: stats.achievements.includes(a.id)
    }))
  }

  // ============================
  // Progressão
  // ============================
  const getExpProgress = () => {
    if (!stats) return 0
    return (stats.currentExp / (stats.currentExp + stats.expToNextLevel)) * 100
  }

  const getLevelName = (level) => {
    if (level >= 50) return 'Lenda'
    if (level >= 40) return 'Mestre'
    if (level >= 30) return 'Especialista'
    if (level >= 20) return 'Avançado'
    if (level >= 10) return 'Intermediário'
    if (level >= 5) return 'Iniciante'
    return 'Novato'
  }

  const refreshStats = () => {
    fetchStats()
  }

  // ============================
  // Init
  // ============================
  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    isLoading,
    error,
    fetchStats,
    refreshStats,
    checkAchievements,
    getAchievements,
    getExpProgress,
    getLevelName
  }
}
