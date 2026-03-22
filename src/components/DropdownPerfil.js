import { Link } from "react-router-dom";
import { User, ChevronDown, LogOut, Users, Settings } from "lucide-react";

export default function DropdownPerfil({
  user,
  isOpen,
  setIsOpen,
  handleLogout,
  userMenu,
}) {
  // Simplificar - aceitar qualquer avatar válido
  const avatarUrl = user?.avatar || null;

  return (
    <div className="relative user-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 group"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>

        <div className="text-left hidden lg:block">
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[160px]">
            {user?.name || "Carregando..."}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email ? "Online" : ""}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.name || "-"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {user?.email || "-"}
              </div>
            </div>
          </div>

          <div className="py-2">
            <Link
              to="/perfil"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Meu Perfil</span>
            </Link>

            <Link
              to="/amigos"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Amigos</span>
            </Link>

            <Link
              to="/configuracoes"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </Link>

            {userMenu
              .filter(item => 
                item.name.toLowerCase() !== 'configurações' &&
                item.name.toLowerCase() !== 'amigos' &&
                item.name.toLowerCase() !== 'meu perfil'
              )
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mx-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}