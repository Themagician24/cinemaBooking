import { StarIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import timeFormat from '../lib/timeFormat';
import { useAppContext } from '../context/AppContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const {image_base_url} = useAppContext();

  return (
    <div
      className="relative group w-80 md:w-96 rounded-3xl overflow-hidden shadow-xl 
        hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-500 
        transform hover:scale-105 hover:-translate-y-2 cursor-pointer perspective-1000"
      onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0); }}
    >
      {/* Image + overlay */}
      <div className="relative h-64 md:h-72 w-full overflow-hidden rounded-3xl">
        <img
          src={image_base_url + movie.backdrop_path}
          alt={movie.title}
          className="h-full w-full object-cover transform transition duration-700 group-hover:scale-110 group-hover:rotate-1"
        />

        {/* Overlay dynamique */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-500 group-hover:opacity-100 opacity-90"></div>

        {/* Badge Année avec pulse */}
        <span className="absolute top-4 left-4 bg-primary/90 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg animate-pulse">
          {new Date(movie.release_date).getFullYear()}
        </span>

        {/* Genres flottants */}
        <span className="absolute bottom-4 left-4 bg-black/60 text-xs px-2 py-1 rounded-md text-gray-200 shadow-sm transition-all duration-300 group-hover:bg-black/80">
          {movie.genres.slice(0, 2).map((genre) => genre.name).join(", ")}
        </span>
      </div>

      {/* Contenu texte */}
      <div className="p-5 flex flex-col gap-3">
        {/* Titre animé */}
        <h3 className="text-xl md:text-2xl font-bold text-white truncate group-hover:text-primary transition-colors duration-300">
          {movie.title}
        </h3>

        {/* Runtime */}
        <p className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">
          {timeFormat(movie.runtime)}
        </p>

        {/* Footer : bouton + rating */}
        <div className="flex items-center justify-between mt-4">
          {/* Buy Tickets */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movies/${movie._id}`);
              scrollTo(0, 0);
            }}
            className="px-5 py-2 text-sm font-semibold rounded-full 
              bg-gradient-to-r from-primary to-pink-600 
              hover:from-pink-600 hover:to-primary 
              shadow-lg hover:shadow-primary/50 
              transition-all duration-300 active:scale-95 text-white"
          >
            Buy Tickets
          </button>

          {/* Rating étoile */}
          <div className="flex items-center gap-1 text-sm text-gray-200">
            <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
            {movie.vote_average.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
