import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import { useHabits } from '../hooks/useHabits'

// ==== CATEGORIAS FIXAS (JS) ====
const HABIT_CATEGORIES = {
  saude: { name: 'Saúde', icon: '❤️' },
  produtividade: { name: 'Produtividade', icon: '⚙️' },
  exercicio: { name: 'Exercício', icon: '💪' },
  estudo: { name: 'Estudo', icon: '📚' },
  social: { name: 'Social', icon: '👥' },
  outro: { name: 'Outro', icon: '✨' }
};

// ==== DIFICULDADES FIXAS (JS) ====
const DIFFICULTY_SETTINGS = {
  facil: { name: 'Fácil', points: 10, color: 'text-green-600' },
  medio: { name: 'Médio', points: 15, color: 'text-yellow-600' },
  dificil: { name: 'Difícil', points: 20, color: 'text-red-600' }
};

// ==== ÍCONES DE HÁBITO ====
const HABIT_ICONS = [
  "🎯","🔥","💧","📚","🏃‍♂️","🧘‍♂️","✨","📈","🍎","💼",
  "💡","🎵","📝","💬","📆","⚡","🌿","🏋️","🛏️","💻"
];

export default function AddHabitPage() {
  const navigate = useNavigate()
  const { createHabit } = useHabits()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✅ ref do form para conseguir submeter pelo botão que fica fora do form
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'saude',
    difficulty: 'facil',
    icon: '🎯',
    color: '#3B82F6' // Pode deixar fixo, já que agora não edita mais
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    document.title = 'Criar Hábito - VidaLevel'
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    else if (formData.name.length < 3) newErrors.name = 'Nome deve ter pelo menos 3 caracteres'

    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória'
    else if (formData.description.length < 10) newErrors.description = 'Descrição deve ter pelo menos 10 caracteres'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    // ✅ backend exige "points", então calculamos a partir da dificuldade
    const payload = {
      ...formData,
      points: DIFFICULTY_SETTINGS[formData.difficulty].points
    }

    const success = await createHabit(payload)
    setIsSubmitting(false)

    if (success) navigate('/habits')
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Hábito</h1>
          <p className="text-gray-600">Defina um novo hábito para sua jornada</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* FORM */}
        <div className="lg:col-span-2">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

            {/* Informações Básicas */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Descreva o hábito..."
                    rows={4}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description ? (
                      <p className="text-red-500 text-sm">{errors.description}</p>
                    ) : <div />}
                    <span className="text-gray-500 text-sm">
                      {formData.description.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categoria e Dificuldade */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categoria e Dificuldade</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="input-field"
                  >
                    {Object.entries(HABIT_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dificuldade
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="input-field"
                  >
                    {Object.entries(DIFFICULTY_SETTINGS).map(([key, diff]) => (
                      <option key={key} value={key}>
                        {diff.name} (+{diff.points} pontos)
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Ícones */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ícone</h2>

              <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
                {HABIT_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleInputChange('icon', icon)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all
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

        {/* PRÉ-VISUALIZAÇÃO + BOTÕES */}
        <div>
          <div className="card p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pré-visualização</h2>

            <motion.div
              key={`${formData.icon}-${formData.color}-${formData.name}`}
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
                  <h3 className="font-semibold text-gray-900">
                    {formData.name || 'Nome do hábito'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {formData.description || 'Descrição do hábito'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${DIFFICULTY_SETTINGS[formData.difficulty].color}
                  bg-current bg-opacity-10`}
                >
                  {DIFFICULTY_SETTINGS[formData.difficulty].name}
                </span>

                <span className="font-semibold text-gray-700">
                  +{DIFFICULTY_SETTINGS[formData.difficulty].points} pontos
                </span>
              </div>
            </motion.div>

            <div className="mt-4 text-sm text-gray-600">
              <p className="mb-2">
                <strong>Categoria:</strong> {HABIT_CATEGORIES[formData.category].name}
              </p>
              <p>
                <strong>Pontos por conclusão:</strong> {DIFFICULTY_SETTINGS[formData.difficulty].points}
              </p>
            </div>

            {/* BOTÕES */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancelar
              </button>

              {/* ✅ botão fica aqui, mas submete o FORM via requestSubmit */}
              <button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                disabled={isSubmitting}
                className="btn-primary px-4 py-2 text-sm flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Criar Hábito</span>
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
