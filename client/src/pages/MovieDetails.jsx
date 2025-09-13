import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import BlurCircle from '../components/BlurCircle';
import { Heart, PlayCircleIcon, StarIcon, Clock, Calendar, Film } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const getShow = async() => {
    const show = dummyShowsData.find(show => show._id === id);
    if(show) {
      setShow({
        movie: show,
        dateTime: dummyDateTimeData
      });
    }
  }

  useEffect(() => {
    getShow();
  }, [id]);

  return show ? (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Background Effects */}
      <BlurCircle top='5%' left='5%' color='orange' opacity='20' />
      <BlurCircle bottom='5%' right='10%' color='purple' opacity='20' />
      
      <div className="relative px-4 md:px-8 lg:px-16 pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Movie Header Section */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Movie Poster */}
            <div className="relative group flex-shrink-0">
              <img 
                src={show.movie.poster_path} 
                alt={show.movie.title} 
                className='rounded-2xl w-full max-w-sm lg:max-w-md shadow-2xl transform group-hover:scale-105 transition-transform duration-500'
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
            </div>

            {/* Movie Details */}
            <div className="flex-1 text-white">
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-3 text-sm text-orange-400 font-medium mb-4">
                  <span>ENGLISH</span>
                  <span className="text-gray-500">•</span>
                  <span>FRENCH</span>
                  <span className="text-gray-500">•</span>
                  <span>SPANISH</span>
                </div>
                
                <h1 className='text-4xl md:text-5xl font-bold mb-4'>{show.movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <StarIcon className='w-5 h-5 text-amber-400 fill-amber-400'/>
                    <span className="font-medium">{show.movie.vote_average.toFixed(1)}</span>
                    <span className="text-gray-400">User Rating</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{timeFormat(show.movie.runtime)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>{show.movie.release_date.split('-')[0]}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Film className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-300">Genres:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {show.movie.genres.map((genre, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed max-w-2xl mb-8">
                  {show.movie.overview}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30">
                  <PlayCircleIcon className='w-5 h-5'/>
                  Watch Trailer
                </button>

                <a href="#dateSelect" className='px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30'>
                  Buy Tickets
                </a>

                <button 
                  className={`p-3 rounded-full transition-all duration-300 ${isFavorite ? 'bg-pink-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Cast Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Featured Cast
              </span>
            </h2>
            
            <div className="relative">
              <div className="overflow-x-auto pb-6 scrollbar-hide">
                <div className="flex gap-6">
                  {show.movie.casts.slice(0,12).map((cast, index) => (
                    <div key={index} className="group flex flex-col items-center text-center min-w-[100px]">
                      <div className="relative mb-3">
                        <img 
                          src={cast.profile_path} 
                          alt={cast.name} 
                          className='rounded-full w-20 h-20 object-cover border-2 border-gray-700 group-hover:border-orange-500 transition-all duration-300'
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
                      </div>
                      <p className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">{cast.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div id="dateSelect" className="mt-20">
            <DateSelect dateTime={show.dateTime} id={show.movie._id}/>
          </div>

          {/* Recommendations */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dummyShowsData.slice(0,4).map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))}
            </div>
          </div>

          {/* Show More Button */}
          <div className="flex justify-center mt-16">
            <button 
              onClick={() => {navigate('/movies'); scrollTo(0,0);}} 
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Show More Movies
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : <Loading/>;
}

export default MovieDetails;