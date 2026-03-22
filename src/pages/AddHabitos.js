import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import { useHabits } from '../hooks/useHabits'

// CATEGORIAS FIXAS
const HABIT_CATEGORIES = {
  saude: { name: 'Saúde', icon: '❤️' },
  produtividade: { name: 'Produtividade', icon: '⚙️' },
  exercicio: { name: 'Exercício', icon: '💪' },
  estudo: { name: 'Estudo', icon: '📚' },
  social: { name: 'Social', icon: '👥' },
  outro: { name: 'Outro', icon: '✨' }
}

// DIFICULDADES FIXAS
const DIFFICULTY_SETTINGS = {
  facil: { name: 'Fácil', points: 10, color: 'text-green-600' },
  medio: { name: 'Médio', points: 15, color: 'text-yellow-600' },
  dificil: { name: 'Difícil', points: 20, color: 'text-red-600' }
}

// ÍCONES PERSONALIZADOS
const HABIT_ICONS = [
  "🎯","🔥","💧","📚","🏃‍♂️","🧘‍♂️","✨","📈","🍎","💼",
  "💡","🎵","📝","💬","📆","⚡","🌿","🏋️","🛏️","💻"
]

export default function AddHabitPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const { createHabit, updateHabit } = useHabits()

  const editingHabit = location.state?.habit
  const isEditing = !!editingHabit

  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)
  // forma padrao
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'saude',
    difficulty: 'facil',
    icon: '🎯',
    color: '#3B82F6'
  })

  const [errors, setErrors] = useState({})

  // preenche formulário se estiver editando
  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: editingHabit.name || '',
        description: editingHabit.description || '',
        category: editingHabit.category || 'saude',
        difficulty: editingHabit.difficulty || 'facil',
        icon: editingHabit.icon || '🎯',
        color: editingHabit.color || '#3B82F6'
      })
    }
  }, [editingHabit, isEditing])
 // criar ou editar
  useEffect(() => {
    document.title = isEditing
      ? 'Editar Hábito - VidaLevel'
      : 'Criar Hábito - VidaLevel'
  }, [isEditing])
//validaçoes
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim())
      newErrors.name = 'Nome é obrigatório'
    else if (formData.name.length < 3)
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'

    if (!formData.description.trim())
      newErrors.description = 'Descrição é obrigatória'
    else if (formData.description.length < 10)
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    const payload = {
      ...formData,
      points: DIFFICULTY_SETTINGS[formData.difficulty].points
    }

    let success

    if (isEditing) {
      success = await updateHabit(editingHabit.id, payload)
    } else {
      success = await createHabit(payload)
    }

    setIsSubmitting(false)

    if (success) navigate('/habits')
  }
  //handle
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/*header*/}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        {/*criar ou editar*/}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Hábito' : 'Criar Novo Hábito'}
          </h1>
          <p className="text-gray-600">
            {isEditing
              ? 'Atualize as informações do seu hábito'
              : 'Defina um novo hábito para sua jornada'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/*form - ocupa 3 colunas */}
        <div className="lg:col-span-3">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

            {/*informaçoes*/}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>

              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nome do Hábito *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Ex: Beber 2 litros de água"
                    maxLength={100}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
                    rows={4}
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.description
                      ? <p className="text-red-500 text-sm">{errors.description}</p>
                      : <div />}
                    <span className="text-gray-500 text-sm">
                      {formData.description.length}/500
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/*categoria + dificuldade*/}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Categoria e Dificuldade</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="input-field"
                >
                  {Object.entries(HABIT_CATEGORIES).map(([key, cat]) => (
                    <option key={key} value={key}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="input-field"
                >
                  {Object.entries(DIFFICULTY_SETTINGS).map(([key, diff]) => (
                    <option key={key} value={key}>
                      {diff.name} (+{diff.points} pts)
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/*icones*/}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Ícone</h2>

              <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
                {HABIT_ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleInputChange('icon', icon)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl
                      ${formData.icon === icon
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

          </form>
        </div>

        {/*preview + botoes*/}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Pré-visualização</h2>

            <motion.div
              key={`${formData.icon}-${formData.name}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="border-2 border-gray-200 rounded-xl p-4"
              style={{ borderLeftColor: formData.color, borderLeftWidth: '4px' }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${formData.color}20` }}
                >
                  {formData.icon}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {formData.name || 'Nome do hábito'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formData.description || 'Descrição do hábito'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold">
                  {DIFFICULTY_SETTINGS[formData.difficulty].name}
                </span>
                <span>
                  +{DIFFICULTY_SETTINGS[formData.difficulty].points} pts
                </span>
              </div>
            </motion.div>

            {/*botoes*/}
            <div className="flex justify-end space-x-9 mt-5">
              <button
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                disabled={isSubmitting}
                className="btn-primary px-4 py-2 text-sm flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isEditing ? 'Salvando...' : 'Criando...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEditing ? 'Salvar Alterações' : 'Criar Hábito'}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}