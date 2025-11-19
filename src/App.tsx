import { useState, useEffect } from 'react';
import { Film, Lock } from 'lucide-react';
import { supabase } from './lib/supabase';
import { MoviesTab } from './components/MoviesTab';
import { RankedCompareTab } from './components/RankedCompareTab';
import { PodcastTab } from './components/PodcastTab';
import { EditorsTab } from './components/EditorsTab';

export interface Movie {
  id: string;
  title: string;
  year: number | null;
  poster_url: string | null;
  franchise: string | null;
  synopsis: string | null;
  runtime: number | null;
  genre: string | null;
  director: string | null;
  producers: string | null;
  budget: string | null;
  distributed_by: string | null;
  imdb_url: string | null;
  episode_url: string | null;
  jonathan_rating: number | null;
  karl_rating: number | null;
  jonathan_rank: number | null;
  karl_rank: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string | null;
}

type Tab = 'movies' | 'ranked' | 'podcast' | 'editors';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('movies');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const EDITOR_PASSWORD = 'sage42';

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'edit') {
      setShowPasswordModal(true);
    }
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching movies:', error);
    } else {
      setMovies(data || []);
    }
    setLoading(false);
  };

  const handleUnlock = () => {
    if (password === EDITOR_PASSWORD) {
      setIsEditMode(true);
      setShowPasswordModal(false);
      setPassword('');
      setActiveTab('editors');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLock = () => {
    setIsEditMode(false);
    setActiveTab('movies');
    const url = new URL(window.location.href);
    url.searchParams.delete('mode');
    window.history.replaceState({}, '', url.toString());
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.franchise?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#2a2a2a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1 w-10 h-10">
                <div className="bg-white rounded flex items-center justify-center text-orange-600 font-bold text-xs">J</div>
                <div className="bg-white rounded flex items-center justify-center text-orange-600 font-bold text-xs">K</div>
                <div className="bg-white rounded flex items-center justify-center text-orange-600 font-bold text-xs">W</div>
                <div className="bg-white rounded flex items-center justify-center text-orange-600 font-bold text-xs">E</div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Jonathan & Karl Watch Everything</h1>
              <p className="text-gray-400 text-sm">watch along with us ...</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-[#3a3a3a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            />
            {isEditMode ? (
              <button
                onClick={handleLock}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Lock</span>
              </button>
            ) : (
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'movies'
                ? 'text-white bg-black'
                : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab('ranked')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'ranked'
                ? 'text-white bg-black'
                : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
            }`}
          >
            Ranked Compare
          </button>
          <button
            onClick={() => setActiveTab('podcast')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'podcast'
                ? 'text-white bg-black'
                : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
            }`}
          >
            Podcast
          </button>
          {isEditMode && (
            <button
              onClick={() => setActiveTab('editors')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'editors'
                  ? 'text-white bg-black'
                  : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
            >
              Editors
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : (
          <>
            {activeTab === 'movies' && <MoviesTab movies={filteredMovies} />}
            {activeTab === 'ranked' && <RankedCompareTab movies={movies} />}
            {activeTab === 'podcast' && <PodcastTab />}
            {activeTab === 'editors' && isEditMode && (
              <EditorsTab movies={movies} onUpdate={fetchMovies} />
            )}
          </>
        )}
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#3a3a3a] rounded-xl border border-gray-700 p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Enter Editor Password</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Password"
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleUnlock}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors font-semibold"
              >
                Unlock
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
