import React, { useState, useEffect } from 'react';
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { CheckIcon, StarIcon, PlusIcon, CalendarIcon, ClockIcon, TicketIcon, XIcon } from 'lucide-react';
import { kConventer } from '../../lib/kConventer';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddShows = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [addingShow, setAddingShow] = useState(false);

  const fetchNowPlayingMovies = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/show/now-playing', {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        }
      });

      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.error('Error fetching movies', error);
      // Fallback to dummy data if API fails
      setNowPlayingMovies(dummyShowsData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });

    setDateTimeInput("");
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

  const handleSubmit =  async () => {
     try {
      setAddingShow(true)

        if(!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice
      ) {
        return toast("Missing required fields")
      }

      const showsInput = Object.entries(dateTimeSelection).map(([date, time]) => ({
        date, time
      }));

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice)
      }

      const { data } = await axios.post('/api/show/add' , payload, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        }
      });

      if(data.success) {
        toast.success(data.message)
        setSelectMovie(null)
        setDateTimeSelection({})
        setShowPrice("")
      }else {
        toast.error(data.message)
      }
      
     } catch (error) {
       console.error("Submission error :", error);
       toast("Something went wrong")
      
     }
     setAddingShow(false)
  }

  useEffect(() => {
    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user]);

  const formatDate = (dateStr) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const isCreateDisabled = !selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice;

  // Function to get image URL
  const getImageUrl = (posterPath) => {
    if (!posterPath) return '/placeholder-movie.jpg';
    
    // Check if it's already a full URL
    if (posterPath.startsWith('http')) {
      return posterPath;
    }
    
    // Check if it starts with / (absolute path)
    if (posterPath.startsWith('/')) {
      return image_base_url + posterPath;
    }
    
    // Otherwise, assume it's relative to image_base_url
    return image_base_url + (posterPath.startsWith('/') ? posterPath : '/' + posterPath);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <Title text1="Create" text2="New Show" subtitle="Design the perfect movie experience" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          {/* Movie Selection Panel */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="bg-gradient-to-r from-violet-700 to-fuchsia-700 p-5 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full"></div>
                <h2 className="text-2xl font-bold flex items-center relative z-10">
                  <TicketIcon className="w-7 h-7 mr-3" />
                  Now Playing Movies
                </h2>
                <p className="text-violet-200 mt-1 relative z-10">
                  {nowPlayingMovies.length} movies available
                </p>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  <svg 
                    className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>

              <div className="p-4 overflow-x-auto custom-scrollbar">
                {nowPlayingMovies.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <TicketIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No movies available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {nowPlayingMovies
                      .filter(movie => 
                        movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((movie) => {
                        const isSelected = selectedMovie === movie.id;
                        const imageUrl = getImageUrl(movie.poster_path);
                        
                        return (
                          <div
                            key={movie.id || movie._id}
                            className={`relative rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer group ${
                              isSelected 
                                ? 'ring-3 ring-emerald-400 shadow-2xl scale-105' 
                                : 'ring-1 ring-white/10 hover:ring-white/30'
                            }`}
                            onClick={() => setSelectMovie(movie.id)}
                          >
                            <div className="aspect-[2/3] relative">
                              <img 
                                src={imageUrl} 
                                alt={movie.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                  e.target.src = '/placeholder-movie.jpg';
                                }}
                              />
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                              
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h3 className="font-bold truncate text-shadow">{movie.title}</h3>
                                <p className="text-xs text-gray-300 text-shadow">
                                  {movie.release_date || 'Unknown date'}
                                </p>

                                <div className="flex justify-between items-center mt-2">
                                  <p className="flex items-center gap-1 text-sm font-semibold text-shadow">
                                    <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    {movie.vote_average?.toFixed(1) || 'N/A'}
                                  </p>
                                  <p className="text-xs text-gray-300 text-shadow">
                                    {kConventer(movie.vote_count || 0)} votes
                                  </p>
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="absolute top-3 right-3 flex items-center justify-center bg-emerald-500 h-7 w-7 rounded-full shadow-lg">
                                <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Show Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl overflow-hidden h-full border border-white/10 shadow-2xl">
              <div className="bg-gradient-to-r from-blue-700 to-cyan-600 p-5 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full"></div>
                <h2 className="text-2xl font-bold flex items-center relative z-10">
                  <CalendarIcon className="w-7 h-7 mr-3" />
                  Show Configuration
                </h2>
                <p className="text-blue-200 mt-1 relative z-10">Customize your show details</p>
              </div>

              <div className="p-5 space-y-6">
                {/* Selected Movie Preview */}
                {selectedMovie && (
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <TicketIcon className="w-5 h-5 mr-2 text-purple-400" />
                      Selected Movie
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-24 rounded-md overflow-hidden shadow-lg flex-shrink-0">
                        <img 
                          src={getImageUrl(nowPlayingMovies.find(m => m.id === selectedMovie)?.poster_path)}
                          alt="Selected movie"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-movie.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {nowPlayingMovies.find(m => m.id === selectedMovie)?.title}
                        </p>
                        <p className="text-sm text-slate-400">
                          {nowPlayingMovies.find(m => m.id === selectedMovie)?.release_date}
                        </p>
                        <div className="flex items-center mt-1">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-sm text-slate-300">
                            {nowPlayingMovies.find(m => m.id === selectedMovie)?.vote_average?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show Price Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Show Price ({currency})
                  </label>
                  <div className="flex items-center bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-cyan-500 transition-all backdrop-blur-md">
                    <span className="text-slate-400">{currency}</span>
                    <input
                      min={0}
                      type="number"
                      value={showPrice}
                      onChange={(e) => setShowPrice(e.target.value)}
                      placeholder="Enter show price"
                      className="bg-transparent outline-none w-full text-white placeholder-slate-500 ml-2"
                    />
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Select Date and Time
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 flex-1 backdrop-blur-md">
                      <CalendarIcon className="w-5 h-5 text-slate-400 mr-2" />
                      <input
                        type="datetime-local"
                        value={dateTimeInput}
                        onChange={(e) => setDateTimeInput(e.target.value)}
                        className="bg-transparent outline-none text-white w-full"
                      />
                    </div>
                    <button
                      onClick={handleDateTimeAdd}
                      disabled={!dateTimeInput}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg shadow-blue-500/20"
                    >
                      <PlusIcon className="w-5 h-5 mr-1" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Selected Showtimes */}
                {Object.keys(dateTimeSelection).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-3 text-slate-300 flex items-center">
                      <ClockIcon className="w-5 h-5 mr-2 text-blue-400" />
                      Selected Showtimes ({Object.values(dateTimeSelection).flat().length})
                    </h3>

                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                      {Object.entries(dateTimeSelection).map(([date, times]) => (
                        <div key={date} className="bg-slate-800/30 p-3 rounded-lg border border-white/5 backdrop-blur-md">
                          <div className="font-medium text-cyan-400 mb-2">
                            {formatDate(date)}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {times.map((time) => (
                              <div key={time} className="bg-cyan-900/30 border border-cyan-700/50 px-3 py-2 flex items-center rounded-lg text-sm group hover:bg-cyan-900/50 transition-colors">
                                <span>{time}</span>
                                <button
                                  onClick={() => handleRemoveTime(date, time)}
                                  className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                                  aria-label="Remove time"
                                >
                                  <XIcon size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Create Show Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isCreateDisabled || addingShow}
                  className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-6 py-4 rounded-xl hover:from-purple-700 hover:to-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 mt-4 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusIcon className="w-6 h-6 mr-2" />
                  {addingShow ? 'Creating Show...' : 'Create Show'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .text-shadow {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
};

export default AddShows;