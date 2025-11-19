import { useState } from 'react';
import { Plus, Save, Trash2, Download, Upload, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Movie } from '../App';

interface EditorsTabProps {
  movies: Movie[];
  onUpdate: () => void;
}

export function EditorsTab({ movies, onUpdate }: EditorsTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Movie>>({});
  const [imdbUrl, setImdbUrl] = useState('');
  const [fetchingImdb, setFetchingImdb] = useState(false);

  const resetForm = () => {
    setFormData({});
    setImdbUrl('');
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (movie: Movie) => {
    setEditingId(movie.id);
    setFormData(movie);
    setImdbUrl(movie.imdb_url || '');
  };

  const handleSave = async () => {
    if (!formData.title) {
      alert('Title is required');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('ratings')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating movie:', error);
        alert('Failed to update movie');
      } else {
        onUpdate();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('ratings')
        .insert(formData);

      if (error) {
        console.error('Error adding movie:', error);
        alert('Failed to add movie');
      } else {
        onUpdate();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    const { error } = await supabase
      .from('ratings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie');
    } else {
      onUpdate();
    }
  };

  const fetchImdbData = async () => {
    if (!imdbUrl) return;

    setFetchingImdb(true);
    try {
      const imdbId = imdbUrl.match(/tt\d+/)?.[0];
      if (!imdbId) {
        alert('Invalid IMDb URL');
        return;
      }

      const response = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=ce23b85d`);
      const data = await response.json();

      if (data.Response === 'True') {
        setFormData(prev => ({
          ...prev,
          title: data.Title,
          year: parseInt(data.Year),
          poster_url: data.Poster !== 'N/A' ? data.Poster : null,
          runtime: data.Runtime !== 'N/A' ? parseInt(data.Runtime) : null,
          genre: data.Genre !== 'N/A' ? data.Genre : null,
          director: data.Director !== 'N/A' ? data.Director : null,
          synopsis: data.Plot !== 'N/A' ? data.Plot : null,
          imdb_url: imdbUrl
        }));
      } else {
        alert('Movie not found on IMDb');
      }
    } catch (error) {
      console.error('Error fetching IMDb data:', error);
      alert('Failed to fetch IMDb data');
    } finally {
      setFetchingImdb(false);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(movies, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jkwe-movies-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedMovies = JSON.parse(e.target?.result as string);

        const { error } = await supabase
          .from('ratings')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');

        if (error) throw error;

        for (const movie of importedMovies) {
          const { id, created_at, updated_at, ...movieData } = movie;
          await supabase.from('ratings').insert(movieData);
        }

        onUpdate();
        alert('Data imported successfully');
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Failed to import data');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Movie Editor</h2>
        <div className="flex gap-3">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Movie Export
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Movie Import
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-[#3a3a3a] rounded-xl p-6 mb-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Movie' : 'Add New Movie'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">IMDb URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imdbUrl}
                  onChange={(e) => setImdbUrl(e.target.value)}
                  placeholder="https://www.imdb.com/title/tt0044081/"
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <button
                  onClick={fetchImdbData}
                  disabled={fetchingImdb}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Fetch IMDb
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="number"
              placeholder="Year"
              value={formData.year || ''}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || null })}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="number"
              placeholder="Jonathan's Rating (16)"
              value={formData.jonathan_rating || ''}
              onChange={(e) => setFormData({ ...formData, jonathan_rating: parseInt(e.target.value) || null })}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="number"
              placeholder="Karl's Rating (23)"
              value={formData.karl_rating || ''}
              onChange={(e) => setFormData({ ...formData, karl_rating: parseInt(e.target.value) || null })}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="Poster URL"
              value={formData.poster_url || ''}
              onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
              className="md:col-span-2 px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="Franchise"
              value={formData.franchise || ''}
              onChange={(e) => setFormData({ ...formData, franchise: e.target.value })}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="Director"
              value={formData.director || ''}
              onChange={(e) => setFormData({ ...formData, director: e.target.value })}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="number"
              placeholder="Runtime (min)"
              value={formData.runtime || ''}
              onChange={(e) => setFormData({ ...formData, runtime: parseInt(e.target.value) || null })}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="Genre"
              value={formData.genre || ''}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="Producers"
              value={formData.producers || ''}
              onChange={(e) => setFormData({ ...formData, producers: e.target.value })}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="Budget"
              value={formData.budget || ''}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="Distributed by"
              value={formData.distributed_by || ''}
              onChange={(e) => setFormData({ ...formData, distributed_by: e.target.value })}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="Episode URL"
              value={formData.episode_url || ''}
              onChange={(e) => setFormData({ ...formData, episode_url: e.target.value })}
              className="md:col-span-2 px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />

            <textarea
              placeholder="Synopsis"
              value={formData.synopsis || ''}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              rows={3}
              className="md:col-span-2 px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-[#3a3a3a] rounded-lg p-4 flex items-center gap-4 hover:bg-[#4a4a4a] transition-colors"
          >
            {movie.poster_url && (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-16 h-24 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-lg">{movie.title}</h4>
              <p className="text-sm text-gray-400">
                {movie.year} {movie.franchise && `• ${movie.franchise}`}
              </p>
              <div className="flex gap-4 mt-1">
                <span className="text-sm">
                  <span className="text-orange-400">Jonathan:</span> {movie.jonathan_rating || '—'}
                </span>
                <span className="text-sm">
                  <span className="text-blue-400">Karl:</span> {movie.karl_rating || '—'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(movie)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(movie.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
