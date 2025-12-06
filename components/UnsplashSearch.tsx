'use client';

import { useState } from 'react';
import { unsplash, type UnsplashPhoto } from '@/lib/unsplash';
import Image from 'next/image';
import { Search } from 'lucide-react';

interface UnsplashSearchProps {
  onSelectImage: (imageUrl: string) => void;
}

export default function UnsplashSearch({ onSelectImage }: UnsplashSearchProps) {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await unsplash.search.getPhotos({
        query,
        perPage: 12,
        orientation: 'landscape',
      });

      if (result.errors) {
        setError(result.errors[0]);
      } else {
        setPhotos(result.response?.results as UnsplashPhoto[] || []);
      }
    } catch (err) {
      setError('Failed to search. Check your API key.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="pool, ocean, mountains..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => {
                const imageUrl = `${photo.urls.raw}&w=1500&h=600&fit=crop`;
                onSelectImage(imageUrl);
              }}
              className="relative aspect-[5/2] rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all group"
            >
              <Image
                src={photo.urls.small}
                alt={photo.alt_description || 'Unsplash photo'}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
