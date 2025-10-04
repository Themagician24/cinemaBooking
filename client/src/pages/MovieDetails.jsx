import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import BlurCircle from '../components/BlurCircle';
import { PlayCircleIcon, StarIcon, Clock, Calendar, Film, ArrowLeft, Share2, Users, Ticket, Sparkles, HeartIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Récupération du contexte global
  const { shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, image_base_url } = useAppContext();

  // Gestion de l'effet de scroll pour la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Récupération des détails du film depuis l'API
  const getShow = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success && data.movie) {
        setShow(data);
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
      toast.error('Failed to load movie details');
    }
  }, [id, axios]);

  // Gestion des favoris avec état optimiste
  const handleFavorite = async () => {
   try {
    if(!user) return toast.error("Please log in to favorite movies.");

    const { data } = await axios.post('/api/user/update-favorite', {
      movieId: id
    }, {
      headers: {
        Authorization: `Bearer ${await getToken()}`
      }
    });

    if(data.success) {
      await fetchFavoriteMovies();
      toast.success(data.message);
    }
   } catch (error) {
    console.error(error);
   }
  };

  // Fonction de partage avec fallback pour les navigateurs non supportés
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: show.movie.title,
          text: `Check out "${show.movie.title}" on our platform!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Ouverture de la bande-annonce YouTube
  const handleWatchTrailer = () => {
    if (show.movie.videos && show.movie.videos.length > 0) {
      const trailer = show.movie.videos.find(video => video.type === 'Trailer');
      if (trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
      } else {
        toast.error('Trailer not available');
      }
    } else {
      toast.error('No trailer available for this movie');
    }
  };

  // Chargement initial des données
  useEffect(() => {
    getShow();
  }, [getShow]);

  // Affichage du loading pendant le chargement
  if (!show) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const movie = show.movie;

  // Filtrage des films recommandés
  const recommendedMovies = shows?.filter(movieItem => movieItem._id !== id).slice(0, 4) || [];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* ===== EFFETS VISUELS D'ARRIÈRE-PLAN ===== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <BlurCircle top='5%' left='5%' color='orange' opacity='20' size='xlarge' />
        <BlurCircle bottom='10%' right='10%' color='purple' opacity='15' size='xlarge' />
        <BlurCircle top='60%' left='70%' color='blue' opacity='10' size='large' />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* ===== NAVBAR FIXE AMÉLIORÉE ===== */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-xl py-4 shadow-2xl border-b border-white/5' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300 group bg-white/5 backdrop-blur-lg px-6 py-3 rounded-2xl border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
            
            {/* Bouton partager amélioré */}
            <button 
              onClick={handleShare}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-white transition-all duration-300 backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/50 hover:from-purple-500/20 hover:to-blue-500/20 group"
            >
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="relative px-4 md:px-8 lg:px-16 pt-32 md:pt-40 pb-20 z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* ===== SECTION HÉRO AMÉLIORÉE ===== */}
          <section className="flex flex-col lg:flex-row gap-12 items-start mb-20">
            
            {/* Poster du film avec effets sophistiqués */}
            <div className="relative group flex-shrink-0 mx-auto lg:mx-0 w-full lg:w-auto">
              <div className={`relative rounded-3xl overflow-hidden transition-all duration-700 shadow-2xl ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <img 
                  src={image_base_url + movie.poster_path} 
                  alt={movie.title}
                  onLoad={() => setImageLoaded(true)}
                  className="w-full max-w-lg lg:max-w-2xl transform group-hover:scale-105 transition-transform duration-700"
                />
                {/* Superpositions d'effets visuels */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500/40 rounded-3xl transition-all duration-500"></div>
                
                {/* Badge de qualité overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-orange-500/90 text-white text-sm font-bold rounded-full backdrop-blur-sm">HD</span>
                  <span className="px-3 py-1 bg-blue-500/90 text-white text-sm font-bold rounded-full backdrop-blur-sm">4K</span>
                </div>
              </div>
              
              {/* Placeholder animé pendant le chargement */}
              {!imageLoaded && (
                <div className="w-full max-w-lg lg:max-w-2xl h-[800px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl animate-pulse flex items-center justify-center">
                  <div className="text-white/60 text-lg flex items-center gap-3">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                    Loading masterpiece...
                  </div>
                </div>
              )}
            </div>

            {/* Détails du film améliorés */}
            <div className="flex-1 text-white space-y-8">
              
              {/* Titre et métadonnées améliorés */}
              <div className="space-y-6">
                {/* Badges de qualité */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30 backdrop-blur-sm font-medium hover:scale-105 transition-transform duration-200 cursor-default">ULTRA HD</span>
                  <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30 backdrop-blur-sm font-medium hover:scale-105 transition-transform duration-200 cursor-default">DOLBY VISION</span>
                  <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 backdrop-blur-sm font-medium hover:scale-105 transition-transform duration-200 cursor-default">DOLBY ATMOS</span>
                </div>
                
                {/* Titre principal avec effet de gradient animé amélioré */}
                <h1 className='text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight tracking-tight hover:scale-105 transition-transform duration-300 cursor-default'>
                  {movie.title}
                </h1>
                
                {/* Tagline amélioré */}
                {movie.tagline && (
                  <p className="text-xl text-gray-300 italic font-light max-w-2xl bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text ">
                    "{movie.tagline}"
                  </p>
                )}
              </div>

              {/* Widgets d'information améliorés */}
              <div className="flex flex-wrap items-center gap-6">
                {/* Note utilisateur améliorée */}
                <div className="flex items-center gap-4 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl px-6 py-4 backdrop-blur-lg border border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 group">
                  <div className="relative">
                    <StarIcon className='w-8 h-8 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform'/>
                    <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  </div>
                  <div>
                    <span className="font-bold text-2xl bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                      {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                    <div className="text-sm text-gray-400 mt-1">User Rating</div>
                  </div>
                </div>

                {/* Durée améliorée */}
                <div className="flex items-center gap-4 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl px-6 py-4 backdrop-blur-lg border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group">
                  <Clock className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-bold text-xl text-white">{timeFormat(movie.runtime)}</span>
                    <div className="text-sm text-gray-400 mt-1">Duration</div>
                  </div>
                </div>

                {/* Date de sortie améliorée */}
                <div className="flex items-center gap-4 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl px-6 py-4 backdrop-blur-lg border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-105 group">
                  <Calendar className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-bold text-xl text-white">{movie.release_date?.split('-')[0] || 'N/A'}</span>
                    <div className="text-sm text-gray-400 mt-1">Release Year</div>
                  </div>
                </div>
              </div>

              {/* Genres interactifs améliorés */}
              <div className="flex flex-wrap gap-3">
                {movie.genres?.map((genre, index) => (
                  <span 
                    key={index}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 rounded-xl border border-orange-500/30 backdrop-blur-sm hover:from-orange-500/30 hover:to-amber-500/30 transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer hover:text-white"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Onglets de navigation améliorés */}
              <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-2 backdrop-blur-lg border border-white/10">
                <div className="flex space-x-2">
                  {['overview', 'details', 'cast'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex-1 text-center capitalize ${
                        activeTab === tab
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenu des onglets amélioré */}
              <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-500 group">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-orange-400 transition-colors duration-300">
                      <Film className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
                      Synopsis
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg font-light group-hover:text-gray-200 transition-colors duration-300">
                      {movie.overview}
                    </p>
                  </div>
                )}
                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-orange-400 transition-colors duration-300">
                      <Sparkles className="w-6 h-6 text-orange-400" />
                      Movie Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                        <strong>Original Language:</strong> 
                        <span className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-3 py-1 rounded-full">
                          {movie.original_language?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                        <strong>Budget:</strong> 
                        <span>{movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                        <strong>Revenue:</strong> 
                        <span>{movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                        <strong>Status:</strong> 
                        <span className={`px-3 py-1 rounded-full ${
                          movie.status === 'Released' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-orange-500/20 text-orange-300'
                        }`}>
                          {movie.status || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ===== SECTION BOUTONS D'ACTION ULTRA STYLISÉE ===== */}
              <div className="pt-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-wrap">
                  
                  {/* Groupe de boutons principaux améliorés */}
                  <div className="flex flex-col sm:flex-row gap-4 flex-1 min-w-0">
                    
                    {/* Bouton Watch Trailer - CTA principal amélioré */}
                    <button 
                      onClick={handleWatchTrailer}
                      className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold transition-all duration-300 hover:from-orange-600 hover:to-amber-600 hover:shadow-2xl hover:shadow-orange-500/40 transform hover:-translate-y-1 active:scale-95 flex-1 min-w-0 max-w-md overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-amber-400/10 animate-pulse"></div>
                      <PlayCircleIcon className='w-6 h-6 relative z-10 group-hover:scale-110 transition-transform'/>
                      <span className="relative z-10 text-lg truncate">Watch Trailer</span>
                      {/* Effet de lumière au survol */}
                      <div className="absolute inset-0 bg-white/5 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>

                    {/* Bouton Buy Tickets - CTA secondaire amélioré */}
                    <a 
                      href="#dateSelect" 
                      className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl font-bold border border-gray-600 transition-all duration-300 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20 transform hover:-translate-y-1 active:scale-95 flex-1 min-w-0 max-w-md overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <Ticket className="w-5 h-5 relative group-hover:scale-110 transition-transform" />
                      <span className="relative truncate">Buy Tickets</span>
                    </a>
                  </div>

                  {/* Groupe de boutons d'actions secondaires améliorés */}
                  <div className="flex gap-4 justify-center sm:justify-start">
                    
                    {/* Bouton favori avec animation avancée améliorée */}
                    <button 
                      onClick={handleFavorite}
                      className="group relative p-3 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <div className={`relative transition-all duration-300 ${
                        favoriteMovies.find(movie => movie._id === id) 
                          ? 'transform scale-110' 
                          : 'group-hover:scale-105'
                      }`}>
                        <HeartIcon 
                          className={`w-6 h-6 transition-all duration-300 ${
                            favoriteMovies.find(movie => movie._id === id) 
                              ? 'fill-red-500 text-red-500 animate-pulse' 
                              : 'text-gray-400 group-hover:text-red-400'
                          }`} 
                        />
                        {/* Effet de pulsation pour le favori */}
                        {favoriteMovies.find(movie => movie._id === id) && (
                          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                        )}
                      </div>
                    </button>

                    {/* Bouton partager avec effet de lumière amélioré */}
                    <button 
                      onClick={handleShare}
                      className="group relative p-3 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <Share2 className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-300 group-hover:scale-105" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SECTION CASTING CORRIGÉE ET AMÉLIORÉE ===== */}
          {movie.casts?.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 flex items-center gap-3">
                  <Users className="w-8 h-8 text-orange-400" />
                  Featured Cast
                </h2>
                <span className="text-gray-400 text-lg font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  {movie.casts.length} actors
                </span>
              </div>
              
              {/* Grille avec photos arrondies et corrections */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movie.casts.slice(0, 12).map((cast, index) => (
                  <div 
                    key={index} 
                    className="group relative bg-gradient-to-br from-white/5 to-white/10 rounded-3xl overflow-hidden backdrop-blur-lg border border-white/10 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20"
                  >
                    {/* Photo de l'acteur avec coins arrondis */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={cast.profile_path ? `${image_base_url}${cast.profile_path}` : '/images/placeholder-avatar.jpg'}
                        alt={cast.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 rounded-t-3xl"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-avatar.jpg';
                          e.currentTarget.classList.add('object-contain', 'p-4');
                        }}
                      />
                      
                      {/* Overlay de gradient pour une meilleure lisibilité */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300 rounded-t-3xl"></div>
                      
                      {/* Effet de lumière au survol */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-3xl"></div>
                    </div>

                    {/* Informations de l'acteur positionnées en bas avec coins arrondis */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent rounded-b-3xl">
                      <div className="text-center">
                        <p className="font-bold text-sm sm:text-base truncate group-hover:text-orange-300 transition-colors duration-300 mb-1">
                          {cast.name}
                        </p>
                        <p className="text-gray-300 text-xs sm:text-sm truncate group-hover:text-gray-200 transition-colors duration-300">
                          {cast.character || 'Actor'}
                        </p>
                      </div>
                    </div>

                    {/* Badge d'indication au survol */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-orange-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        View
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {movie.casts.length > 12 && (
                <div className="text-center mt-10">
                  <button className="px-8 py-3 bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-400 rounded-xl border border-orange-500/20 transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg hover:bg-orange-500/20 hover:text-white">
                    View All Cast ({movie.casts.length})
                  </button>
                </div>
              )}
            </section>
          )}

          {/* ===== SECTION SÉLECTION DE DATE AMÉLIORÉE ===== */}
          <section id="dateSelect" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-3 hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-3">
                <Ticket className="w-8 h-8" />
                Select Showtime
              </h2>
              <p className="text-gray-400 text-lg">Choose your preferred date and time</p>
            </div>
            <DateSelect dateTime={show.dateTime} id={movie._id}/>
          </section>

          {/* ===== SECTION RECOMMANDATIONS AMÉLIORÉE ===== */}
          {recommendedMovies.length > 0 && (
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                  You Might Also Like
                </h2>
                <p className="text-gray-400 text-lg mt-2">Discover similar masterpieces</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {recommendedMovies.map((movieItem) => (
                  <div 
                    key={movieItem._id} 
                    className="group relative transition-all duration-700"
                  >
                    <div className="relative z-10 transform transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-4 group-hover:z-20">
                      <MovieCard movie={movieItem} />
                    </div>
                    
                    {/* Effet de halo au hover */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10 group-hover:scale-110"></div>
                    
                    {/* Effet de flou pour les autres cartes quand une carte est survolée */}
                    <div className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm -z-20 scale-105"></div>
                  </div>
                ))}
              </div>

              {/* Instructions visuelles */}
              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Hover over movies to preview them clearly
                  <Sparkles className="w-4 h-4" />
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;