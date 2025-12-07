import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

// Pontos baseados na dificuldade
const DIFFICULTY_SETTINGS = {
  facil: 10,
  medio: 15,
  dificil: 20
}

export function useHabits() {
  const [habits, setHabits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carrega hábitos iniciais (mock)
  const fetchHabits = async () => {
    try {
      setIsLoading(true)
      setError(null)

      await new Promise(res => setTimeout(res, 500))

      const mock = [
        { id: 1, name: "Beber água", category: "saude", description: "Tomar água durante o dia", icon: "💧", difficulty: "facil", points: 10, streak: 0, isActive: true, color: "#3B82F6" },
        { id: 2, name: "Ler 10 min", category: "estudo", description: "Leitura diária", icon: "📚", difficulty: "medio", points: 15, streak: 1, isActive: true, color: "#10B981" }
      ]

      setHabits(mock)
    } catch (err) {
      console.error(err)
      setError("Erro ao carregar hábitos")
    } finally {
      setIsLoading(false)
    }
  }

  // Criar hábito
  const createHabit = async (habitData) => {
    const newHabit = {
      id: Date.now(),
      streak: 0,
      isActive: true,
      points: DIFFICULTY_SETTINGS[habitData.difficulty], 
      ...habitData
    }

    setHabits(prev => [newHabit, ...prev])
    toast.success("Hábito criado! 🎉")
    return true
  }

  // Atualizar
  const updateHabit = async (id, updates) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === id ? { ...h, ...updates } : h
      )
    )

    toast.success("Hábito atualizado!")
    return true
  }

  // Excluir
  const deleteHabit = async (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
    toast.success("Hábito removido!")
    return true
  }

  // Completar
  const completeHabit = async (id) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === id ? { ...h, streak: h.streak + 1 } : h
      )
    )

    toast.success("+10 pontos! 🎉")
    return true
  }

  // Ativar/desativar
  const toggleHabitStatus = async (id) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === id ? { ...h, isActive: !h.isActive } : h
      )
    )
    return true
  }

  const getHabitsByCategory = (category) =>
    category ? habits.filter(h => h.category === category) : habits

  const getActiveHabits = () => habits.filter(h => h.isActive)

  const getHabitsCompletedToday = () => habits.filter(h => h.streak > 0)

  useEffect(() => {
    fetchHabits()
  }, [])

  return {
    habits,
    isLoading,
    error,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    toggleHabitStatus,
    getHabitsByCategory,
    getActiveHabits,
    getHabitsCompletedToday
  }
}
