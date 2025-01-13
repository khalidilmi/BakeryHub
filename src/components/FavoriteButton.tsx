'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

export default function FavoriteButton({ bakerId }: { bakerId: number }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/favorites/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bakerId }),
      });

      if (res.ok) {
        setIsFavorited((prev) => !prev);
      } else {
        console.error('Failed to update favorite status:', await res.text());
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      aria-label={isFavorited ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
    >
      <Heart 
        className={`h-6 w-6 transition-colors duration-200 ${
          isFavorited 
            ? 'fill-red-500 text-red-500' 
            : 'fill-none text-gray-400 hover:text-red-500'
        }`}
      />
    </button>
  );
}
