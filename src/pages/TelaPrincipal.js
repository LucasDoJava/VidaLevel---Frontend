import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Target, Search, Pencil, Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import HabitCard from '../components/CardHabits'
import { useHabits } from '../hooks/useHabits'
import { useDebounce } from '../hooks/useDebounce' 

export default function MyHabits() {
  const navigate = useNavigate()
  const { habits, completeHabit, deleteHabit, isLoading: habitsLoading } = useHabits()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  
  //hook debounce para evitar muitas requisições enquanto o usuário digita
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const [category, setCategory] = useState('all')
  const [completed, setCompleted] = useState('all')
  const [habitToDelete, setHabitToDelete] = useState(null)

  const categories = ['all', ...new Set(
    habits.map(h => h.category).filter(Boolean)
  )]

  //funçao para buscar sugestões
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    try { //rota de procurar por habitos com o solr
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://localhost:5000/habits/search?q=${encodeURIComponent(query)}&autocomplete=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error)
    }
  }

  //funçao para buscar hábitos
  const searchHabits = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://localhost:5000/habits/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        //mapeando os resultados do solr para o formato esperado pelo CardHabit
        const results = data.response?.docs?.map(doc => ({
          id: doc.id,
          name: doc.name_t,
          description: doc.description_t,
          category: doc.category_s,
          difficulty: doc.difficulty_s,
          streak: doc.streak_i,
          points: doc.points_i,
          color: doc.color_s,
          icon: doc.icon_s
        })) || []
        setSearchResults(results)
      }
    } catch (error) {
      console.error('Erro ao buscar hábitos:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // buscar sugestoes quando o termo de busca muda
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSuggestions(debouncedSearchTerm)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [debouncedSearchTerm])

  //buscar resultados quando o usuário pressiona Enter
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      searchHabits(searchTerm)
      setShowSuggestions(false)
    }
  }

  //funçao para selecionar uma sugestao
  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    searchHabits(suggestion)
  }

  //funçao para limpar a busca
  const handleClearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
    setSuggestions([])
    setShowSuggestions(false)
  }

  // determinar quais hábitos mostrar (resultados da busca OU todos os hábitos filtrados)
  const habitsToShow = searchResults.length > 0 
    ? searchResults 
    : habits.filter(habit => {
        const matchesSearch = searchTerm === '' || 
          habit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          habit.description?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = category === 'all' || habit.category === category
        const matchesCompleted = completed === 'all' ||
          (completed === 'completed' && habit.streak > 0) ||
          (completed === 'notCompleted' && habit.streak === 0)

        return matchesSearch && matchesCategory && matchesCompleted
      })

  useEffect(() => {
    document.title = 'Meus Hábitos - VidaLevel'
  }, [])

  //fechar sugestoes ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
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
      {/*header*/}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Meus Hábitos</h1>
        <p className="text-gray-600">
          Gerencie e acompanhe seus hábitos diários
        </p>
      </div>

      {/*filtros e busca */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/*campo de busca com autocomplete */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSearchSubmit}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar hábitos (digite para sugestões)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </form>

          {/*sugestoes de autocomplete*/}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/*indicador de busca */}
          {isSearching && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
          {/*categorias*/}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
          onChange={(e) => setCompleted(e.target.value)}
          className="border rounded-lg px-3 py-2.5"
        >
          <option value="all">Todos</option>
          <option value="completed">Completados</option>
          <option value="notCompleted">Não completados</option>
        </select>
      </div>

      {/*indicador de resultados da busca*/}
      {searchResults.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando resultados da busca para "{searchTerm}"
          </p>
          <button
            onClick={handleClearSearch}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Limpar busca
          </button>
        </div>
      )}

      {/*botao novo hábito */}
      <div className="flex justify-end mb-6">
        <Link
          to="/add-habit"
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Hábito
        </Link>
      </div>

      {/*lista de habitos */}
      {habitsToShow.length > 0 ? (
        <motion.div className="space-y-4">
          {habitsToShow.map(habit => (
            <div key={habit.id} className="relative">
              <HabitCard
                habit={habit}
                onComplete={() => completeHabit(habit.id)}
              />

              {/*botoes editar e deletar */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => navigate('/add-habit', { state: { habit } })}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Editar hábito"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>

                <button
                  onClick={() => setHabitToDelete(habit)}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                  title="Excluir hábito"
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
            {searchTerm 
              ? `Nenhum hábito encontrado para "${searchTerm}"`
              : 'Nenhum hábito encontrado'}
          </p>
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Limpar busca
            </button>
          )}
        </div>
      )}

      {/*modal de confirmaçao*/}
      {habitToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Deseja excluir "{habitToDelete.name}"?
            </h2>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setHabitToDelete(null)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  deleteHabit(habitToDelete.id)
                  setHabitToDelete(null)
                  setSearchResults(prev => prev.filter(h => h.id !== habitToDelete.id))
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
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