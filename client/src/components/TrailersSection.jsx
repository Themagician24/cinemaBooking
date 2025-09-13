import { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import ReactPlayer from 'react-player';
import BlurCircle from './BlurCircle';
import { PlayCircleIcon } from 'lucide-react';

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden relative">
      
      {/* Section Title */}
      <p className="text-gray-300 font-semibold text-2xl md:text-3xl max-w-[960px] animate-fadeIn">
        Trailers
      </p>

      {/* Current Trailer */}
      <div className="relative mt-6 rounded-xl overflow-hidden shadow-2xl hover:shadow-primary/40 transition-shadow duration-500">
        <BlurCircle top="-100px" right="-100px" />
        <ReactPlayer
          url={currentTrailer.videoUrl}
          controls={false}
          playing={false}
          className="mx-auto max-w-full rounded-xl"
          width="100%"
          height="540px"
        />
        {/* Overlay play button */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <PlayCircleIcon className="w-16 h-16 text-primary animate-pulse opacity-80" />
        </div>
      </div>

      {/* Trailers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mt-10 max-w-5xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            onClick={() => setCurrentTrailer(trailer)}
            className="relative cursor-pointer group rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={trailer.image}
              alt="trailer"
              className="h-48 md:h-60 w-full object-cover rounded-xl brightness-75 group-hover:brightness-90 transition-all duration-300"
            />
            <div className="absolute inset-0 flex justify-center items-center">
              <PlayCircleIcon
                strokeWidth={1.6}
                className="w-10 h-10 md:w-12 md:h-12 text-primary opacity-90 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
