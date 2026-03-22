import { useState, useEffect } from 'react';
import { 
  Users, 
  UserMinus, 
  Trash2,
  User,
  Mail,
  Check,
  X,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { apiFetch } from '../services/api';

export default function Friends() {
  const { user, token } = useAuth();
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [friendToRemove, setFriendToRemove] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Carregar amigos e solicitações
  useEffect(() => {
    document.title = 'Amigos - VidaLevel';
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      await Promise.all([
        loadFriends(),
        loadPendingRequests()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const data = await apiFetch('/friends', {
        method: 'GET'
      });
      setFriends(data);
    } catch (error) {
      console.error('Erro ao carregar amigos:', error);
      showNotification(error.message || 'Erro ao carregar amigos', 'error');
    }
  };

  const loadPendingRequests = async () => {
    try {
      const data = await apiFetch('/friend-request/pending', {
        method: 'GET'
      });
      setPendingRequests(data);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
    }
  };

  const respondToRequest = async (requestId, action) => {
    try {
      await apiFetch(`/friend-request/${requestId}/${action}`, {
        method: 'PUT'
      });
      
      showNotification(`Solicitação ${action === 'accept' ? 'aceita' : 'recusada'} com sucesso!`, 'success');
      await loadPendingRequests();
      if (action === 'accept') {
        await loadFriends();
      }
    } catch (error) {
      console.error('Erro ao responder solicitação:', error);
      showNotification(error.message || 'Erro ao responder solicitação', 'error');
    }
  };

  const removeFriend = async (friendId) => {
    try {
      console.log('Removendo amigo ID:', friendId);
      
      // Usando o novo endpoint DELETE /friends/<friend_id>
      await apiFetch(`/friends/${friendId}`, {
        method: 'DELETE'
      });
      
      // Atualizar a lista local removendo o amigo
      setFriends(friends.filter(f => f.id !== friendId));
      setFriendToRemove(null);
      showNotification('Amigo removido com sucesso!', 'success');
      
    } catch (error) {
      console.error('Erro ao remover amigo:', error);
      showNotification(error.message || 'Erro ao remover amigo', 'error');
      setFriendToRemove(null);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient">Amigos</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas amizades e visualize sua lista de amigos
          </p>
        </div>
      </motion.div>

      {/* Notificação */}
      <AnimatePresence>
        {notification.show && (
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
      </AnimatePresence>

      {/* Solicitações Pendentes */}
      {pendingRequests.filter(r => r.status === 'pending').length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">Solicitações Pendentes</h2>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
              {pendingRequests.filter(r => r.status === 'pending').length}
            </span>
          </div>

          <div className="space-y-4">
            {pendingRequests
              .filter(r => r.status === 'pending')
              .map(request => (
                <div 
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{request.sender_name}</div>
                      <div className="text-sm text-gray-500">{request.sender_email}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => respondToRequest(request.id, 'accept')}
                      className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                      title="Aceitar"
                    >
                      <Check className="w-5 h-5 text-green-600" />
                    </button>
                    <button
                      onClick={() => respondToRequest(request.id, 'reject')}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                      title="Recusar"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Lista de Amigos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        {/* Header da lista */}
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Meus Amigos</h2>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {friends.length}
          </span>
        </div>

        {/* Grid de amigos */}
        {friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{friend.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {friend.email}
                        </div>
                      </div>
                    </div>

                    {/* Botão de remover */}
                    <button
                      onClick={() => setFriendToRemove(friend)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                      title="Remover amigo"
                    >
                      <UserMinus className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum amigo adicionado
            </h3>
            <p className="text-gray-500">
              Você ainda não tem amigos na sua lista. 
              Adicione amigos através do modal de busca.
            </p>
          </div>
        )}
      </motion.div>

      {/* Modal de confirmação para remover amigo */}
      <AnimatePresence>
        {friendToRemove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setFriendToRemove(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-2">Remover Amigo</h2>
              <p className="text-gray-600 text-center mb-6">
                Tem certeza que deseja remover <span className="font-semibold">{friendToRemove.name}</span> da sua lista de amigos?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setFriendToRemove(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => removeFriend(friendToRemove.id)}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}