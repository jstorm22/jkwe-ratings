import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Movie } from '../App';

interface MoviesTabProps {
  movies: Movie[];
}

export function MoviesTab({ movies }: MoviesTabProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (movies.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        No movies yet. Add some in editor mode!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="group relative"
          onMouseEnter={() => setHoveredId(movie.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-200 group-hover:scale-105 group-hover:shadow-2xl">
            {movie.poster_url ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Poster
              </div>
            )}

            <div className="absolute top-2 right-2 flex gap-1">
              <div className="px-2 py-1 bg-gray-900/90 backdrop-blur-sm rounded text-xs font-bold border border-gray-700">
                <span className="text-orange-400">J#{movie.jonathan_rating || '?'}</span>
              </div>
              <div className="px-2 py-1 bg-gray-900/90 backdrop-blur-sm rounded text-xs font-bold border border-gray-700">
                <span className="text-blue-400">K#{movie.karl_rating || '?'}</span>
              </div>
            </div>

            {hoveredId === movie.id && (
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 flex flex-col justify-end animate-in fade-in duration-200">
                <h3 className="font-bold text-lg mb-1 line-clamp-2">{movie.title}</h3>
                {movie.year && (
                  <p className="text-gray-400 text-sm mb-2">{movie.year}</p>
                )}
                {movie.franchise && (
                  <p className="text-orange-400 text-xs mb-2 font-medium">{movie.franchise}</p>
                )}
                {movie.synopsis && (
                  <p className="text-gray-300 text-xs line-clamp-3 mb-3">{movie.synopsis}</p>
                )}
                {(movie.runtime || movie.genre) && (
                  <div className="flex gap-2 text-xs text-gray-400 mb-3">
                    {movie.runtime && <span>{movie.runtime} min</span>}
                    {movie.runtime && movie.genre && <span>•</span>}
                    {movie.genre && <span>{movie.genre}</span>}
                  </div>
                )}
                {movie.episode_url && (
                  <a
                    href={movie.episode_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Listen to our episode
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium text-center line-clamp-2">{movie.title}</p>
            {movie.year && (
              <p className="text-xs text-gray-500 text-center">({movie.year})</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
