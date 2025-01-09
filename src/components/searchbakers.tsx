'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Store } from 'lucide-react';

interface Baker {
  id: number;
  baker_name: string;
  business_type: string;
}

export default function SearchBakers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Baker[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setResults([]);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(`/api/bakers/search?search=${query}`);

      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        console.error('Failed to fetch search results:', await res.text());
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBaker = (id: number) => {
    router.push(`/baker/${id}`);
    setResults([]);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-600" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Søg efter bagere..."
          className="w-full pl-10 pr-4 py-2 border-2 border-amber-200 focus:border-amber-500 rounded-lg shadow-sm"
        />
      </div>

      {isSearching && (
        <div className="absolute mt-2 w-full text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      )}

      {results.length > 0 && (
        <ul className="absolute w-full bg-white border border-amber-200 rounded-lg mt-2 max-h-60 overflow-auto z-10 shadow-lg">
          {results.map((baker) => (
            <li
              key={baker.id}
              onClick={() => handleSelectBaker(baker.id)}
              className="p-4 hover:bg-amber-50 cursor-pointer border-b border-amber-100 last:border-b-0 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-amber-600" />
                <div>
                  <h2 className="font-semibold text-gray-800">{baker.baker_name}</h2>
                  <p className="text-sm text-gray-600">{baker.business_type}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {searchQuery && results.length === 0 && !isSearching && (
        <div className="absolute w-full bg-white border border-amber-200 rounded-lg mt-2 p-4 text-center text-gray-500 shadow-lg">
          Ingen resultater fundet
        </div>
      )}
    </div>
  );
}
