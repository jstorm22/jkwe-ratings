import type { Movie } from '../App';

interface RankedCompareTabProps {
  movies: Movie[];
}

export function RankedCompareTab({ movies }: RankedCompareTabProps) {
  const jonathanRanked = movies
    .filter(m => m.jonathan_rank)
    .sort((a, b) => (a.jonathan_rank || 0) - (b.jonathan_rank || 0));

  const karlRanked = movies
    .filter(m => m.karl_rank)
    .sort((a, b) => (a.karl_rank || 0) - (b.karl_rank || 0));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-orange-400">Jonathan's Rankings</h2>
        <div className="space-y-2">
          {jonathanRanked.map((movie, index) => (
            <div
              key={movie.id}
              className="flex items-center gap-4 p-3 bg-[#3a3a3a] rounded-lg hover:bg-[#4a4a4a] transition-colors"
            >
              <div className="text-2xl font-bold text-orange-400 w-8">
                {index + 1}.
              </div>
              <div className="flex-1">
                <p className="font-medium">{movie.title}</p>
                {movie.year && <p className="text-sm text-gray-400">({movie.year})</p>}
              </div>
            </div>
          ))}
          {jonathanRanked.length === 0 && (
            <p className="text-gray-400 text-center py-10">No rankings yet</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-blue-400">Karl's Rankings</h2>
        <div className="space-y-2">
          {karlRanked.map((movie, index) => (
            <div
              key={movie.id}
              className="flex items-center gap-4 p-3 bg-[#3a3a3a] rounded-lg hover:bg-[#4a4a4a] transition-colors"
            >
              <div className="text-2xl font-bold text-blue-400 w-8">
                {index + 1}.
              </div>
              <div className="flex-1">
                <p className="font-medium">{movie.title}</p>
                {movie.year && <p className="text-sm text-gray-400">({movie.year})</p>}
              </div>
            </div>
          ))}
          {karlRanked.length === 0 && (
            <p className="text-gray-400 text-center py-10">No rankings yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
