import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import AddFriendModal from "../components/AddFriendModal";
import DropdownPerfil from "../components/DropdownPerfil";
import DropdownNotificacao from "../components/DropdownNotificacao";
import {
  Menu,
  X,
  User,
  LogOut,
  Trophy,
  Target,
  ChevronDown,
  Settings,
  BarChart,
  Users,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const navigation = [ //navegaçao
    { name: "Meus Hábitos", href: "/", icon: Target },
    { name: "Estatísticas", href: "/estatisticas", icon: BarChart },
    { name: "Ranking", href: "/ranking", icon: Trophy },
  ];

  const userMenu = [ //menu
    { name: "Meu Perfil", href: "/profile", icon: User },
    { name: "Configurações", href: "/settings", icon: Settings },
  ];

  const isActiveRoute = (href) => location.pathname === href;
  //sair da conta
  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  //buscar pedidos pendentes
  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/friend-request/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setPendingRequests(data || []);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };
  //resposta
  const respondToRequest = async (id, action) => {
    try {
      await apiFetch(`/friend-request/${id}/${action}`, {
        method: "PUT",
      });

      await fetchPendingRequests();

      toast.success(
        action === "accept"
          ? "Pedido aceito com sucesso! 🎉"
          : "Pedido recusado com sucesso."
      );
    } catch (error) {
      toast.error("Erro ao responder pedido.");
      console.error("Erro ao responder:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPendingRequests();
    }
  }, [token]);
//fecha drop ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
      if (!event.target.closest(".notification-dropdown")) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/*logo*/}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-xl">VL</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    VidaLevel
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Transformando hábitos
                  </span>
                </div>
              </Link>
            </div>

            {/*navegação*/}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-semibold"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/*usuário + amigos + notificações */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/*botao amigos*/}
              <button
                onClick={() => setIsFriendModalOpen(true)}
                className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300"
              >
                <Users className="w-5 h-5" />
              </button>

              {/*notificaçoes */}
              <DropdownNotificacao //abre o drop
                isOpen={isNotificationOpen}
                setIsOpen={setIsNotificationOpen}
                pendingRequests={pendingRequests}
                respondToRequest={respondToRequest}
              />

              {/*perfil*/}
              <DropdownPerfil
                user={user}
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
                handleLogout={handleLogout}
                userMenu={userMenu}
              />
            </div>

            {/*versao da navbar mobile*/}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/*modal amigos*/}
      <AddFriendModal
        isOpen={isFriendModalOpen}
        onClose={() => setIsFriendModalOpen(false)}
      />
    </>
  );
}
