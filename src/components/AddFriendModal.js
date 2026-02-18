import { useState, useEffect } from "react";
import { X, UserPlus, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../services/api";

export default function AddFriendModal({ isOpen, onClose }) {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔎 Buscar usuários ao abrir o modal
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const data = await apiFetch("/users", {
          method: "GET",
        });

        setUsers(data);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        setMessage(err.message || "Erro ao buscar usuários.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen]);

  // 🔎 Filtrar usuários
  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.id !== user?.id &&
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [search, users, user]);

  // ➕ Enviar pedido de amizade
  const handleAddFriend = async (receiverId) => {
    try {
      setMessage("");

      await apiFetch("/friend-request", {
        method: "POST",
        body: JSON.stringify({
          receiver_id: receiverId,
        }),
      });

      setMessage("Pedido enviado com sucesso! 🎉");
    } catch (err) {
      console.error("Erro ao enviar pedido:", err);
      setMessage(err.message || "Erro ao enviar pedido.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Adicionar Amigo
        </h2>

        {/* Campo busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && (
          <p className="text-sm text-gray-500">Carregando...</p>
        )}

        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div>
                <p className="font-medium text-sm">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>

              <button
                onClick={() => handleAddFriend(u.id)}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Adicionar
              </button>
            </div>
          ))}

          {search && filteredUsers.length === 0 && (
            <p className="text-sm text-gray-500">
              Nenhum usuário encontrado.
            </p>
          )}
        </div>

        {message && (
          <div className="mt-4 text-sm text-center text-blue-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
