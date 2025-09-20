import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Sun,
  Moon,
  User,
  Settings,
  LogOut
} from 'lucide-react'

const AdminNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Appliquer le thème au chargement du composant
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  }, [])

  // Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const notifications = [
    { id: 1, text: 'Nouvelle réservation reçue', time: '5 min ago', read: false },
    { id: 2, text: 'Spectacle ajouté avec succès', time: '1 hour ago', read: false },
    { id: 3, text: 'Problème de serveur résolu', time: '2 hours ago', read: true },
  ]

  const user = {
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: assets.profile
  }

  return (
    <nav 
      className={`flex items-center justify-between px-6 md:px-10 lg:px-16 h-20 
      bg-black/90 backdrop-blur-md 
      transition-all duration-300 
      ${isScrolled ? 'border-b border-red-500/30 shadow-lg' : 'border-b border-gray-700/30'}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-4 group">
        <img 
          src={assets.logo} 
          alt="Logo" 
          className="w-40 h-auto transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]"
        />
      </Link>

      {/* Recherche */}
      <div className="hidden md:flex items-center relative w-1/3 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-gray-800/60 border border-gray-700 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent 
            text-white transition-all duration-300"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Mode jour/nuit */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-800/40 hover:bg-gray-700/60 
          transition-all duration-300 hover:rotate-45 group relative"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-400 group-hover:text-yellow-300" />
          ) : (
            <Moon className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full bg-gray-800/40 hover:bg-gray-700/60 relative"
          >
            <Bell className="h-5 w-5 text-gray-300" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center 
              rounded-full bg-red-500 text-xs text-white">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-gray-700 bg-gray-800/80">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b border-gray-800 hover:bg-gray-800/60 ${!notification.read ? 'bg-gray-800/40' : ''}`}
                  >
                    <p className="text-white text-sm">{notification.text}</p>
                    <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Menu utilisateur */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pr-2 rounded-full bg-gray-800/40 hover:bg-gray-700/60"
          >
            <img 
              src={user.avatar} 
              alt={user.name}
              className="h-8 w-8 rounded-full border-2 border-red-500/60 object-cover"
            />
            <span className="hidden md:block text-white text-sm font-medium">{user.name}</span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-gray-700">
                <p className="text-white font-medium truncate">{user.name}</p>
                <p className="text-gray-400 text-sm truncate">{user.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/60">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/60">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
