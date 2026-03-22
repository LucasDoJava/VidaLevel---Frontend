import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Check, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function Configuracoes() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    document.title = 'Configurações - VidaLevel';
    applyTheme(theme);
  }, []);

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (selectedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Sistema - verificar preferência do sistema
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
     
      
      showNotification('Configurações salvas com sucesso!', 'success');
    } catch (error) {
      showNotification('Erro ao salvar configurações', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const themes = [
    {
      id: 'light',
      name: 'Claro',
      icon: Sun,
      description: 'Tema claro padrão',
      preview: 'bg-white text-gray-900 border-gray-200'
    },
    {
      id: 'dark',
      name: 'Escuro',
      icon: Moon,
      description: 'Tema escuro para ambientes com pouca luz',
      preview: 'bg-gray-900 text-white border-gray-700'
    },
    {
      id: 'system',
      name: 'Sistema',
      icon: Monitor,
      description: 'Seguir as configurações do seu dispositivo',
      preview: 'bg-gradient-to-r from-white to-gray-900 text-gray-900 dark:text-white'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gradient">Configurações</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Personalize sua experiência no VidaLevel
        </p>
      </motion.div>

      {/* Notificação */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Card de Configurações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Aparência</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Escolha o tema que mais combina com você
          </p>
        </div>

        <div className="space-y-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => handleThemeChange(themeOption.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                theme === themeOption.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === themeOption.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                <themeOption.icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {themeOption.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {themeOption.description}
                </div>
              </div>

              {theme === themeOption.id && (
                <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>

        {/* Preview ao vivo */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Prévia ao vivo
          </h3>
          <div className={`p-4 rounded-xl border ${themes.find(t => t.id === theme)?.preview} transition-all duration-300`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">V</span>
              </div>
              <div>
                <div className="font-semibold">Olá, {user?.name || 'Visitante'}!</div>
                <div className="text-sm opacity-75">Bem-vindo ao VidaLevel</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
                Hábito 1
              </div>
              <div className="h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
                Hábito 2
              </div>
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar configurações
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Dica */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        💡 O tema escuro ajuda a reduzir o cansaço visual e economiza bateria
      </motion.div>
    </div>
  );
}