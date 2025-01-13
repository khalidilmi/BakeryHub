'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import Link from 'next/link';
import { Store, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBakers from '@/components/searchbakers';

interface Baker {
  id: number;
  user_id: number;
  baker_name: string;
  business_type: string;
}

export default function AllBakers() {
  const [bakers, setBakers] = useState<Baker[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBakers = async () => {
      const res = await fetch('/api/bakers', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setBakers(data);
      } else if (res.status === 401) {
        router.push('/userlogin');
      }
      setLoading(false);
    };

    fetchBakers();
  }, [router]);
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      if (res.ok) {
        router.push('/');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Kunne ikke logge ud.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Der opstod en fejl under logud.');
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-xl">
            <SearchBakers />
          </div>
          <Button 
            onClick={handleLogout} 
            className="ml-4 bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Log ud
          </Button>
        </div>
      </div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bagere i nærheden</h1>
          <p className="text-gray-600">Find din lokale bager og se deres udvalg</p>
        </div>
        <Link href="/favorites">
          <button className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 shadow-md">
            <Heart className="h-5 w-5" />
            <span>Mine Favoritter</span>
          </button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bakers.map((baker) => (
          <div 
            key={baker.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="cursor-pointer flex-grow"
                  onClick={() => router.push(`/baker/${baker.id}`)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Store className="h-6 w-6 text-amber-600" />
                    <h2 className="text-xl font-semibold text-gray-800">{baker.baker_name}</h2>
                  </div>
                  <p className="text-gray-600">{baker.business_type}</p>
                </div>
                <FavoriteButton bakerId={baker.id} />
              </div>
              
              <button 
                onClick={() => router.push(`/baker/${baker.id}`)}
                className="w-full mt-4 px-4 py-2 bg-amber-50 text-amber-800 rounded-md hover:bg-amber-100 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Se udvalg
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}