import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const navigate = useNavigate()
  const { favoritesMovies } = useAppContext()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/', label: 'Theaters' },
    { to: '/', label: 'Releases' },
    // Ajoute le lien Favorites seulement si favoritesMovies existe et n'est pas vide
    ...(favoritesMovies && favoritesMovies.length > 0 ? [{ to: '/favorite', label: 'Favorites' }] : []),
  ]

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-gradient-to-b from-black/70 via-black/30 to-transparent backdrop-blur-lg border-b border-white/10 shadow-lg">
      {/* Logo */}
      <Link to="/" className="max-md:flex-1">
        <img
          src={assets.logo}
          alt="logo"
          className="w-36 h-auto hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Menu */}
      <div
        className={`
          max-md:fixed max-md:top-0 max-md:left-0 z-40 flex flex-col md:flex-row items-center gap-8 
          font-medium md:text-sm lg:text-base tracking-wide
          transition-all duration-500 ease-in-out
          ${isOpen
            ? 'max-md:w-full max-md:h-screen bg-black/90 backdrop-blur-xl text-white'
            : 'max-md:w-0 max-md:h-0 max-md:opacity-0 overflow-hidden'}
          md:bg-white/10 md:rounded-full md:px-10 md:py-2 md:border md:border-white/10 md:shadow-lg
        `}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-7 h-7 cursor-pointer hover:text-primary transition"
          onClick={() => setIsOpen(false)}
        />

        {links.map(({ to, label }) => (
          <Link
            key={label}
            to={to}
            onClick={() => {
              scrollTo(0, 0)
              setIsOpen(false)
            }}
            className="relative group"
          >
            <span className="transition text-gray-300 group-hover:text-white">{label}</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer text-gray-300 hover:text-white transition" />

        {!user ? (
          <button
            onClick={openSignIn}
            className="px-5 py-2 bg-gradient-to-r from-primary to-pink-600 rounded-full font-medium text-white shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate('/my-bookings')}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer text-gray-300 hover:text-white transition"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  )
}

export default Navbar
