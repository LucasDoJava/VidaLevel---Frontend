import { useState } from 'react'
import { CheckCircle, Edit, Trash2, Target, Flame, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HabitCard({
  habit,
  onComplete,
  onEdit,
  onDelete,
  showActions = true
}) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)

  const progressPercentage =
    habit.bestStreak > 0 ? (habit.streak / habit.bestStreak) * 100 : 0

  const handleComplete = async () => {
    if (isCompleting) return

    setIsCompleting(true)
    try {
      const success = await onComplete(habit.id, notes.trim() || undefined)
      if (success) {
        setNotes('')
        setShowNotes(false)
      }
    } finally {
      setIsCompleting(false)
    }
  }

  const handleNotesSubmit = (e) => {
    e.preventDefault()
    handleComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card p-6 hover:shadow-xl transition-all duration-300"
      style={{ borderLeft: `4px solid ${habit.color}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${habit.color}20` }}
          >
            {habit.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{habit.name}</h3>
            <p className="text-gray-600 text-sm">{habit.description}</p>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center space-x-1">
            {onEdit && (
              <button
                onClick={() => onEdit(habit)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Editar hábito"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(habit.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Excluir hábito"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">
              {habit.streak}
            </span>
          </div>
          <p className="text-xs text-gray-600">Sequência</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900">
              {habit.bestStreak}
            </span>
          </div>
          <p className="text-xs text-gray-600">Recorde</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">
              {habit.totalCompletions}
            </span>
          </div>
          <p className="text-xs text-gray-600">Total</p>
        </div>
      </div>

      {/* Progress Bar */}
      {habit.bestStreak > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progresso da sequência</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="progress-bar"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Notes Input */}
      {showNotes && (
        <form onSubmit={handleNotesSubmit} className="mb-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Adicione uma anotação (opcional)..."
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            rows={3}
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {notes.length}/200 caracteres
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowNotes(false)
                  setNotes('')
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCompleting}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isCompleting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Complete Button */}
      {!showNotes && (
        <div className="flex space-x-2">
          <button
            onClick={() => setShowNotes(true)}
            className="flex-1 btn-secondary text-sm py-2"
          >
            Adicionar nota
          </button>

          <button
            onClick={handleComplete}
            disabled={isCompleting || !habit.isActive}
            className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isCompleting ? 'Completando...' : 'Completar'}</span>
          </button>
        </div>
      )}

      {/* Status Indicator */}
      {!habit.isActive && (
        <div className="mt-2 text-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Hábito pausado
          </span>
        </div>
      )}
    </motion.div>
  )
}
