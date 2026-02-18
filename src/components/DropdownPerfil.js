import { Link } from "react-router-dom";
import { User, ChevronDown, LogOut } from "lucide-react";

export default function DropdownPerfil({
  user,
  isOpen,
  setIsOpen,
  handleLogout,
  userMenu,
}) {
  return (
    <div className="relative user-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-300 group"
      >
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>

        <div className="text-left hidden lg:block">
          <div className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
            {user?.name || "Carregando..."}
          </div>
          <div className="text-xs text-gray-500">
            {user?.email ? "Online" : ""}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-900">
              {user?.name || "-"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {user?.email || "-"}
            </div>
          </div>

          <div className="py-2">
            {userMenu.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg mx-2"
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
