import React, { useState } from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { Heart, Search, Filter, Grid3X3, List, Star, Play } from 'lucide-react'

const Favorite = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les films selon la recherche (simulé)
  const filteredMovies = dummyShowsData.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 overflow-hidden'>
      {/* Effets d'arrière-plan avancés */}
      <BlurCircle top='10%' left='5%' color='orange' size='large' opacity='30' />
      <BlurCircle bottom='15%' right='8%' color='purple' size='large' opacity='30' />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-orange-500/5 to-transparent"></div>
      
      <div className="relative px-4 md:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto py-12">
        {/* En-tête avec animations */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mb-6 shadow-lg shadow-orange-500/30 animate-pulse-slow">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Your <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Favorites</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Curated collection of your most loved cinematic experiences
          </p>
        </div>

        {/* Barre de contrôle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-lg">
          <div className="relative w-full md:w-96 mb-4 md:mb-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your favorites..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-800/50 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List size={20} />
              </button>
            </div>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800/50 border border-gray-700/50 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="date">Recently Added</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        {filteredMovies.length > 0 ? (
          <>
            {/* Affichage des films */}
            <div className={viewMode === 'grid' ? 
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12" : 
              "flex flex-col gap-6 mb-12"
            }>
              {filteredMovies.map((movie) => (
                <div key={movie._id} className={`transform transition-all duration-500 hover:scale-105 ${viewMode === 'list' ? 'flex gap-6 items-center bg-gray-900/30 p-4 rounded-2xl border border-gray-800/50' : ''}`}>
                  <MovieCard movie={movie} viewMode={viewMode} />
                  {viewMode === 'list' && (
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                      <div className="flex items-center mb-3">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                        <span className="text-amber-400 mr-4">{movie.vote_average}</span>
                        <span className="text-gray-400 text-sm">{movie.release_date.split('-')[0]}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{movie.overview}</p>
                      <div className="flex space-x-3">
                        <button className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-medium transition-all">
                          <Play className="w-4 h-4 mr-1" />
                          Watch
                        </button>
                        <button className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-full transition-all">
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Statistiques et actions */}
            <div className="flex flex-col md:flex-row justify-between items-center p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl border border-orange-500/20 mb-12">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-2">Your Collection</h3>
                <p className="text-orange-300">
                  {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} saved
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="px-5 py-2.5 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all">
                  Share Collection
                </button>
                <button className="px-5 py-2.5 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-all">
                  Create Playlist
                </button>
              </div>
            </div>
          </>
        ) : (
          // État lorsque aucun film n'est trouvé
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-800">
              <Search className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No favorites found</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              {searchQuery ? `No results for "${searchQuery}"` : 'You haven\'t added any movies to your favorites yet.'}
            </p>
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                Clear Search
              </button>
            ) : (
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all">
                Browse Movies
              </button>
            )}
          </div>
        )}
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s infinite;
        }
      `}</style>
    </div>
  )
}

export default Favorite;