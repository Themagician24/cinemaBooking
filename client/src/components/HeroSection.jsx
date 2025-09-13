import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <div className="relative flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 h-screen text-white overflow-hidden">
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[url('/backgroundImage.png')] bg-cover bg-center -z-10 filter brightness-75"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent -z-10"></div>

      {/* Logo */}
      <img src={assets.marvelLogo} alt="hero-logo" className="max-h-12 md:h-14 mt-20 drop-shadow-lg animate-fadeIn"/>

      {/* Title */}
      <h1 className="text-5xl md:text-[70px] md:leading-[1.1] font-extrabold max-w-110 animate-slideUp">
        Guardians <br /> of the Galaxy
      </h1>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-3 text-sm md:text-base animate-fadeIn delay-300">
        <span className="px-4 py-1 rounded-full bg-primary/30 text-primary font-semibold shadow-lg border border-primary/50 hover:scale-105 transition-transform">
          Action | Adventure | Fantasy
        </span>
        <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full shadow hover:scale-105 transition-transform">
          <CalendarIcon className="w-4 h-4 text-primary animate-pulse" /> 2018
        </div>
        <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full shadow hover:scale-105 transition-transform">
          <ClockIcon className="w-4 h-4 text-primary animate-pulse" /> 2h 8m
        </div>
      </div>

      {/* Description */}
      <p className="max-w-md text-gray-300 text-lg mt-2 animate-fadeIn delay-500">
        In a post-apocalyptic world where cities ride on wheels and consume each other to survive, two people meet in London and try to stop a conspiracy.
      </p>

      {/* Call-to-action */}
      <button 
        onClick={() => navigate('/movies')} 
        className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-primary to-pink-600 rounded-full font-bold text-white shadow-2xl hover:scale-105 hover:shadow-primary/60 transition-transform transform text-lg mt-4 animate-fadeIn delay-700"
      >
        Explore Movies
        <ArrowRight className="w-5 h-5"/>
      </button>
    </div>
  )
}

export default HeroSection
