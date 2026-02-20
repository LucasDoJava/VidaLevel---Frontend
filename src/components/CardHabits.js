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

  // ✅ Normaliza campos (camelCase e snake_case)
  const isActive = habit.isActive ?? habit.is_active ?? true
  const streak = habit.streak ?? habit.currentStreak ?? habit.current_streak ?? 0
  const bestStreak = habit.bestStreak ?? habit.best_streak ?? 0
  const totalCompletions = habit.totalCompletions ?? habit.total_completions ?? 0

  const progressPercentage =
    bestStreak > 0 ? (streak / bestStreak) * 100 : 0

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
                type="button"
                onClick={() => onEdit(habit)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Editar hábito"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
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
          <div className="flex items-center justify-center mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-lg font-bold text-gray-900">{streak}</div>
          <div className="text-xs text-gray-500">Sequência</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-lg font-bold text-gray-900">{bestStreak}</div>
          <div className="text-xs text-gray-500">Recorde</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-bold text-gray-900">{totalCompletions}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>

      {/* Progress bar */}
      {bestStreak > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(progressPercentage, 100)}%`,
                background: `linear-gradient(90deg, ${habit.color}, #7c3aed)`
              }}
            />
          </div>
        </div>
      )}

      {/* Notes */}
      {showNotes && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleNotesSubmit}
          className="mb-3"
        >
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Adicione uma nota sobre hoje..."
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={2}
          />
        </motion.form>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="flex-1 btn-secondary text-sm py-2"
          >
            Adicionar nota
          </button>

          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleting || isActive === false}
            className="flex-1 btn-primary text-sm py-2 flex items-center gap-2 !justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            title={isActive === false ? 'Hábito pausado' : 'Completar hábito'}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isCompleting ? 'Completando...' : 'Completar'}</span>
          </button>
        </div>
      )}

      {/* Status */}
      {isActive === false && (
        <div className="mt-2 text-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Hábito pausado
          </span>
        </div>
      )}
    </motion.div>
  )
}
