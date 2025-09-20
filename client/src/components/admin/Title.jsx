import React, { useState, useEffect, useMemo } from "react"

const Title = ({ text1, text2, subtitle }) => {
  const [isVisible, setIsVisible] = useState(false)

  // Fixer des positions aléatoires une seule fois
  const particles = useMemo(() => {
    return [...Array(4)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${i * 0.6}s`,
      duration: `${3 + i}s`,
    }))
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative inline-block group mb-12">
      {/* Titre principal */}
      <h1
        className={`font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <span className="text-gray-500 dark:text-gray-400">{text1}</span>{" "}
        <span className="relative inline-block">
          {/* Texte dégradé animé */}
          <span className="relative z-10 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
            {text2}
          </span>

          {/* Soulignement animé */}
          <span className="absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-blue-400 to-pink-500 transition-all duration-500 ease-out group-hover:w-full rounded-full">
            <span className="absolute top-0 left-0 w-3 h-3 -mt-1 -ml-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></span>
          </span>
        </span>
      </h1>

      {/* Sous-titre optionnel */}
      {subtitle && (
        <p
          className={`mt-4 text-lg text-gray-600 dark:text-gray-400 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {subtitle}
        </p>
      )}

      {/* Glow d’arrière-plan */}
      <div className="absolute -inset-6 -z-10 bg-gradient-radial from-blue-400/20 via-purple-500/10 to-pink-400/5 blur-3xl group-hover:opacity-90 opacity-0 transition-opacity duration-700 rounded-xl"></div>

      {/* Particules flottantes */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 bg-purple-400/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            top: p.top,
            left: p.left,
            animation: `float ${p.duration} infinite ease-in-out`,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Styles animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-6px) translateX(4px);
          }
          66% {
            transform: translateY(6px) translateX(-4px);
          }
        }
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default Title
