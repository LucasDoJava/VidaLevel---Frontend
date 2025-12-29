import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  User,
  LogOut,
  Trophy,
  Target,
  Bell,
  ChevronDown,
  Settings
} from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(false)

  const user = {
    name: "Usuário Demo",
    email: "demo@example.com"
  }

  const logout = () => {
    console.log("Logout removido temporariamente")
  }

  const location = useLocation()

  // 🔹 Navegação ajustada
  const navigation = [
    { name: 'Meus Hábitos', href: '/', icon: Target },
    { name: 'Estatísticas', href: '/stats', icon: Trophy },
  ]

  const userMenu = [
    { name: 'Meu Perfil', href: '/profile', icon: User },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ]

  const isActiveRoute = (href) => location.pathname === href

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!(event.target.closest('.user-dropdown'))) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
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

          {/* Navegação desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = isActiveRoute(item.href)

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
                  )}
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                  <span className="relative">{item.name}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Usuário */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Notificações */}
            <button
              onClick={() => setHasNotifications(!hasNotifications)}
              className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300 relative"
            >
              <Bell className="w-5 h-5" />
              {hasNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </button>

            {/* Dropdown */}
            <div className="relative user-dropdown">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>

                <div className="text-left hidden lg:block">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">Online</div>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                  </div>

                  <div className="py-2">
                    {userMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={logout}
                      className="flex items-center space-x-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg mx-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  )
}
