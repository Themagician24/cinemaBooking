import React, { useState, useEffect } from 'react';
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { CheckIcon, StarIcon, PlusIcon, CalendarIcon, ClockIcon, TicketIcon, XIcon } from 'lucide-react';
import { kConventer } from '../../lib/kConventer';

const AddShows = () => {
  // Devise du site
  const currency = import.meta.env.VITE_CURRENCY;

  // Etats principaux
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [activeTab, setActiveTab] = useState("movies");

  // Charger les films à l'affiche
  const fetchNowPlayingMovies = async () => {
    setNowPlayingMovies(dummyShowsData);
  };

  // Ajouter une date et heure sélectionnées
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

    // Réinitialiser l'input après ajout
    setDateTimeInput("");
  };

  // Supprimer un horaire
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

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  // Formater les dates pour affichage
  const formatDate = (dateStr) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  // Vérifier si le bouton "Create Show" doit être activé
  const isCreateDisabled = !selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice;

  return nowPlayingMovies.length > 0 ? (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Title text1="Create" text2="New Show" subtitle="Design the perfect movie experience" />

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

          {/* Panel gauche - Sélection du film */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-violet-700 to-fuchsia-700 p-5">
                <h2 className="text-2xl font-bold flex items-center">
                  <TicketIcon className="w-7 h-7 mr-3" />
                  Now Playing Movies
                </h2>
                <p className="text-violet-200 mt-1">Select a movie to create showtimes</p>
              </div>

              <div className="p-4 overflow-x-auto custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {nowPlayingMovies.map((movie) => {
                    const isSelected = selectedMovie === movie.id;
                    return (
                      <div
                        key={movie._id}
                        className={`relative rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                          isSelected ? 'ring-3 ring-emerald-400 shadow-2xl' : 'ring-1 ring-slate-700'
                        }`}
                        onClick={() => setSelectMovie(movie.id)}
                        title={movie.title}
                      >
                        <div className="aspect-[2/3] relative group">
                          <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />

                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="font-bold truncate">{movie.title}</h3>
                            <p className="text-xs text-slate-300">{movie.release_date}</p>

                            <div className="flex justify-between items-center mt-2">
                              <p className="flex items-center gap-1 text-sm font-semibold">
                                <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                {movie.vote_average.toFixed(1)}
                              </p>
                              <p className="text-xs text-slate-300">{kConventer(movie.vote_count)} votes</p>
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
              </div>
            </div>
          </div>

          {/* Panel droit - Configuration du show */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl overflow-hidden h-full">
              <div className="bg-gradient-to-r from-blue-700 to-cyan-600 p-5">
                <h2 className="text-2xl font-bold flex items-center">
                  <CalendarIcon className="w-7 h-7 mr-3" />
                  Show Configuration
                </h2>
                <p className="text-blue-200 mt-1">Customize your show details</p>
              </div>

              <div className="p-5 space-y-6">

                {/* Aperçu du film sélectionné */}
                {selectedMovie && (
                  <div className="bg-slate-800/50 p-4 rounded-xl">
                    <h3 className="font-semibold text-lg mb-2">Selected Movie</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-24 rounded-md overflow-hidden">
                        <img
                          src={nowPlayingMovies.find((m) => m.id === selectedMovie)?.poster_path}
                          alt="Selected movie"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{nowPlayingMovies.find((m) => m.id === selectedMovie)?.title}</p>
                        <p className="text-sm text-slate-400">{nowPlayingMovies.find((m) => m.id === selectedMovie)?.release_date}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Prix du show */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Show Price</label>
                  <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-cyan-500 transition-all">
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

                {/* Sélection de date et heure */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Select Date and Time</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 flex-1">
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
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center transition-all shadow-lg shadow-blue-500/20"
                    >
                      <PlusIcon className="w-5 h-5 mr-1" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Affichage des horaires sélectionnés */}
                {Object.keys(dateTimeSelection).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-3 text-slate-300 flex items-center">
                      <ClockIcon className="w-5 h-5 mr-2" />
                      Selected Showtimes
                    </h3>

                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                      {Object.entries(dateTimeSelection).map(([date, times]) => (
                        <div key={date} className="bg-slate-800/30 p-3 rounded-lg">
                          <div className="font-medium text-cyan-400 mb-2">{formatDate(date)}</div>
                          <div className="flex flex-wrap gap-2">
                            {times.map((time) => (
                              <div key={time} className="bg-cyan-900/30 border border-cyan-700/50 px-3 py-2 flex items-center rounded-lg text-sm">
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

                {/* Bouton créer show */}
                <button
                  disabled={isCreateDisabled}
                  className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-6 py-4 rounded-xl hover:from-purple-700 hover:to-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center font-bold shadow-lg shadow-purple-500/20 mt-4"
                >
                  <PlusIcon className="w-6 h-6 mr-2" />
                  Create Show
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <Loading />
    </div>
  );
};

export default AddShows;
