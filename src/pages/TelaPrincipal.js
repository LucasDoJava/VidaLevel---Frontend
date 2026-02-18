import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Target, Search, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import HabitCard from '../components/CardHabits'
import { useHabits } from '../hooks/useHabits'

export default function MyHabits() {
  const navigate = useNavigate()
  const { habits, completeHabit, deleteHabit, isLoading: habitsLoading } = useHabits()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [completed, setCompleted] = useState('all')

  const [habitToDelete, setHabitToDelete] = useState(null)

  const categories = ['all', ...new Set(
    habits.map(h => h.category).filter(Boolean)
  )]

  const filteredHabits = habits.filter(habit => {
    const matchesSearch =
      habit.name?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === 'all' || habit.category === category

    const matchesCompleted =
      completed === 'all' ||
      (completed === 'completed' && habit.streak > 0) ||
      (completed === 'notCompleted' && habit.streak === 0)

    return matchesSearch && matchesCategory && matchesCompleted
  })

  useEffect(() => {
    document.title = 'Meus Hábitos - VidaLevel'
  }, [])

  if (habitsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Meus Hábitos</h1>
        <p className="text-gray-600">
          Gerencie e acompanhe seus hábitos diários
        </p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar hábitos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2.5"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Todas categorias' : cat}
            </option>
          ))}
        </select>

        <select
          value={completed}
          onChange={e => setCompleted(e.target.value)}
          className="border rounded-lg px-3 py-2.5"
        >
          <option value="all">Todos</option>
          <option value="completed">Completados</option>
          <option value="notCompleted">Não completados</option>
        </select>
      </div>

      {/* Botão novo hábito */}
      <div className="flex justify-end mb-6">
        <Link
          to="/add-habit"
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Hábito
        </Link>
      </div>

      {/* Lista */}
      {filteredHabits.length > 0 ? (
        <motion.div className="space-y-4">
          {filteredHabits.map(habit => (
            <div key={habit.id} className="relative">

              <HabitCard
                habit={habit}
                onComplete={() => completeHabit(habit.id)}
              />

              {/* Botões Editar / Deletar */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => navigate('/add-habit', { state: { habit } })}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>

                <button
                  onClick={() => setHabitToDelete(habit)}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

            </div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-white border rounded-xl p-8 text-center">
          <Target className="mx-auto w-10 h-10 text-gray-400 mb-4" />
          <p className="text-gray-600">
            Nenhum hábito encontrado
          </p>
        </div>
      )}

      {/* Modal de confirmação */}
      {habitToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Deseja excluir esse "{habitToDelete.name}"?
            </h2>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setHabitToDelete(null)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  deleteHabit(habitToDelete.id)
                  setHabitToDelete(null)
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
