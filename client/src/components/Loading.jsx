import React from 'react'

const Loading = () => {
  return (
    <div className='flex flex-col justify-center items-center h-[80vh] bg-black'>
      {/* Spinner avec effet de film */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-orange-500/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin"></div>
        
        {/* Icône de projecteur */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-orange-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
        </div>
      </div>

      {/* Text avec effet de clignotement */}
      <p className="text-orange-400 text-lg font-medium flex items-center">
        Please Wait
        <span className="inline-flex ml-1">
          <span className="animate-pulse">.</span>
          <span className="animate-pulse" style={{animationDelay: '0.2s'}}>.</span>
          <span className="animate-pulse" style={{animationDelay: '0.4s'}}>.</span>
        </span>
      </p>

      {/* Effet de lumière de projecteur */}
      <div className="absolute bottom-0 w-40 h-40 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
    </div>
  )
}

export default Loading