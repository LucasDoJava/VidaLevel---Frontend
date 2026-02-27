import { useState, useEffect, useMemo } from "react";
import { X, UserPlus, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../services/api";

export default function AddFriendModal({ isOpen, onClose }) {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [message, setMessage] = useState("");

  //carrega usuarios quando o modal abre
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setMessage("");

        const data = await apiFetch("/users", { method: "GET" }); //listar usuarios

        
        const list = Array.isArray(data) ? data : data?.users;
          //normaliza os usuarios
        const normalized = (Array.isArray(list) ? list : [])
          .map((u) => ({
            id: u.id,
            name: u.name ?? "Sem nome",
            email: u.email ?? "",
            avatar: u.avatar ?? null,
          }))
          .filter((u) => u.id && u.id !== user?.id);

        setAllUsers(normalized);
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
        setMessage(err?.message || "Erro ao carregar usuários.");
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, user?.id]);

  // filtra no front conforme digita
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allUsers;

    return allUsers.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [search, allUsers]);

  async function handleAddFriend(receiverId) {
    try {
      if (!receiverId) {
        setMessage("Usuário inválido.");
        return;
      }

      setSendingId(receiverId);
      setMessage("");

      // endpoint do backend 
      const res = await apiFetch("/friend-request", {
        method: "POST",
        body: { receiver_id: receiverId },
      });

      setMessage(res?.message || "Pedido enviado com sucesso! 🎉");

      // remove da lista após enviar
      setAllUsers((prev) => prev.filter((u) => u.id !== receiverId));
    } catch (err) {
      console.error("Erro ao enviar pedido:", err);
      setMessage(err?.message || "Erro ao enviar pedido.");
    } finally {
      setSendingId(null);
    }
  }

  function handleClose() {
    setSearch("");
    setMessage("");
    setSendingId(null);
    onClose?.();
  }

  if (!isOpen) return null;
//montando o modal
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          aria-label="Fechar"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" /> Adicionar Amigo
        </h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuário por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && <p className="text-sm text-gray-500">Carregando usuários...</p>}

        <div className="max-h-60 overflow-y-auto space-y-2">
          {!loading &&
            filteredUsers.map((u) => (
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
                  disabled={sendingId === u.id}
                  className="bg-blue-600 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  {sendingId === u.id ? "Enviando..." : "Adicionar"}
                </button>
              </div>
            ))}

          {!loading && filteredUsers.length === 0 && (
            <p className="text-sm text-gray-500">
              {search.trim() ? "Nenhum usuário encontrado." : "Nenhum usuário disponível."}
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
