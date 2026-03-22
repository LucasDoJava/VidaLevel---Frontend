import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Trash2,
  ArrowLeft,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { apiFetch } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

export default function Perfil() {
  const navigate = useNavigate();
  const { user: currentUser, token, logout, updateUser } = useAuth(); // <-- PEGAR updateUser
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    document.title = 'Meu Perfil - VidaLevel';
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
      // Verificar se o avatar existe
      if (currentUser.avatar) {
        setAvatarPreview(currentUser.avatar);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [currentUser]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecione uma imagem válida', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification('A imagem deve ter no máximo 5MB', 'error');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    showNotification('Avatar removido! Clique em "Salvar alterações" para confirmar.', 'success');
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showNotification('Nome é obrigatório', 'error');
      return;
    }
    if (!formData.email.trim()) {
      showNotification('Email é obrigatório', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Preparar os dados para enviar
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      
      
      if (avatarPreview) {
        updateData.avatar = avatarPreview;
      }
      
      console.log('Enviando para o backend:', { ...updateData, avatar: updateData.avatar ? 'base64...' : null });
      
      // Atualizar no backend
      await apiFetch(`/users/${currentUser.id}`, {
        method: 'PUT',
        body: updateData
      });
      
      // Buscar os dados atualizados do usuário
      const updatedUser = await apiFetch(`/users/${currentUser.id}`, {
        method: 'GET'
      });
      
      console.log('Usuário atualizado do backend:', updatedUser);
      
      
      if (updateUser) {
        updateUser(updatedUser);
      } else {
        
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }
      
      // Atualizar o avatar preview local
      if (updatedUser.avatar) {
        setAvatarPreview(updatedUser.avatar);
      }
      
      showNotification('Perfil atualizado com sucesso!', 'success');
      
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showNotification(error.message || 'Erro ao salvar perfil', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await apiFetch(`/users/${currentUser.id}`, {
        method: 'DELETE'
      });
      
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      showNotification(error.message || 'Erro ao deletar conta', 'error');
      setShowDeleteModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gradient">Meu Perfil</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie suas informações pessoais
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

      {/* Card do Perfil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div 
              className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center cursor-pointer group overflow-hidden"
              onClick={handleAvatarClick}
            >
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            {avatarPreview && (
              <button
                onClick={handleRemoveAvatar}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Remover avatar"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          <button
            onClick={handleAvatarClick}
            className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Alterar foto
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            PNG, JPG, GIF até 5MB
          </p>
        </div>

        {/* Formulário */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar alterações
                </>
              )}
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Excluir conta
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Excluir conta"
        message="Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos permanentemente."
        confirmText={isLoading ? "Excluindo..." : "Sim, excluir minha conta"}
        cancelText="Cancelar"
        confirmVariant="danger"
      />

      {/* Modal de sucesso */}
      <ConfirmModal
        isOpen={showSuccessModal}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Conta excluída"
        message="Sua conta foi excluída com sucesso. Você será redirecionado para a página de login."
        confirmText="OK"
        cancelText=""
        confirmVariant="primary"
      />
    </div>
  );
}