import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import HabitCard from '../components/CardHabits'
import { useHabits } from '../hooks/useHabits'   // <= IMPORT AQUI!

export default function MyHabits() {

  // Agora usando DE VERDADE o hook
  const { habits, completeHabit, isLoading: habitsLoading } = useHabits()

  const activeHabits = habits.filter(habit => habit.isActive)
  const recentHabits = activeHabits.slice(0, 5)

  useEffect(() => {
    document.title = 'Meus Habitos - VidaLevel'
  }, [])

  if (habitsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Meus Hábitos
        </h1>
        <p className="text-gray-600 mt-1">
          Gerencie e acompanhe seus hábitos diários
        </p>
      </div>

      {/* Botão de adicionar hábito */}
      <div className="flex justify-end mb-6">
        <Link
          to="/add-habit"
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors duration-300"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Hábito</span>
        </Link>
      </div>

      {/* Lista de Hábitos */}
      {recentHabits.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {recentHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <HabitCard
                habit={habit}
                onComplete={() => completeHabit(habit.id)}
                showActions={true}
              />
            </motion.div>
          ))}

          {/* Ver todos */}
          {habits.length > recentHabits.length && (
            <div className="text-center pt-6 border-t border-gray-200">
              <Link
                to="/habits"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>Ver todos os hábitos ({habits.length})</span>
                <span className="ml-1">→</span>
              </Link>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-200 rounded-xl p-8 text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum hábito criado ainda
          </h3>
          <p className="text-gray-600 mb-6">
            Comece criando seu primeiro hábito para começar sua jornada!
          </p>
          <Link 
            to="/add-habit" 
            className="bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeiro Hábito</span>
          </Link>
        </motion.div>
      )}

      {/* Contador de hábitos */}
      {habits.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <span className="font-medium">{activeHabits.length}</span> hábitos ativos
              {habits.length > activeHabits.length && (
                <span className="ml-2">
                  • <span className="font-medium">{habits.length - activeHabits.length}</span> inativos
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="font-medium">{habits.length}</span> total
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
