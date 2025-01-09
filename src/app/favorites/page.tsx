'use client';

import { useEffect, useState } from 'react';
import { Store, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Favorite {
  bakerId: number;
  bakerName: string;
  businessType: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/favorites', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        } else {
          console.error('Failed to fetch favorites:', await res.text());
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleDeleteFavorite = async (bakerId: number) => {
    try {
      const res = await fetch('/api/favorites/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bakerId }),
      });

      if (res.ok) {
        setFavorites((prev) => prev.filter((favorite) => favorite.bakerId !== bakerId));
      } else {
        console.error('Failed to delete favorite:', await res.text());
      }
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <Link 
          href="/all-bakers" 
          className="inline-flex items-center text-gray-600 hover:text-amber-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Tilbage til oversigten
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mine Favorit Bagere</h1>
        <p className="text-gray-600">Her kan du se og administrere dine favoritbagere</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ingen favoritter endnu</h2>
          <p className="text-gray-600 mb-6">Du har ikke tilføjet nogle bagere til dine favoritter</p>
          <Link href="/all-bakers">
            <button className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200">
              Find bagere
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div 
              key={favorite.bakerId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div 
                  className="cursor-pointer"
                  onClick={() => router.push(`/baker/${favorite.bakerId}`)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Store className="h-6 w-6 text-amber-600" />
                    <h2 className="text-xl font-semibold text-gray-800">{favorite.bakerName}</h2>
                  </div>
                  <p className="text-gray-600 mb-4">{favorite.businessType}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/baker/${favorite.bakerId}`)}
                    className="flex-1 px-4 py-2 bg-amber-50 text-amber-800 rounded-md hover:bg-amber-100 transition-colors duration-200"
                  >
                    Se udvalg
                  </button>
                  <button
                    onClick={() => handleDeleteFavorite(favorite.bakerId)}
                    className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    <Heart className="h-5 w-5 fill-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
