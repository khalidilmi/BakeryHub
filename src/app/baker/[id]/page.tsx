'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Clock, Package, Store, Phone, MapPin, User } from 'lucide-react';
import Link from 'next/link';

interface Baker {
  baker_name: string;
  mobile_number: string;
  street: string;
  city: string;
  zip_code: string;
}

interface Product {
  id: number;
  baker_id: number;
  name: string;
  description: string;
  price: number;
}

interface BakeryHour {
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
}

export default function BakerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hours, setHours] = useState<BakeryHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [baker, setBaker] = useState<Baker | null>(null);
  const router = useRouter();
  const params = useParams();
  const bakerId = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, hoursRes, bakerRes] = await Promise.all([
          fetch(`/api/bakers/${bakerId}/products`, { credentials: 'include' }),
          fetch(`/api/bakers/${bakerId}/hours`, { credentials: 'include' }),
          fetch(`/api/bakers/${bakerId}`, { credentials: 'include' }),
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        } else if (productsRes.status === 401) {
          router.push('/userlogin');
        }

        if (hoursRes.ok) {
          const hoursData = await hoursRes.json();
          setHours(hoursData);
        }

        if (bakerRes.ok) {
          const bakerData = await bakerRes.json();
          setBaker(bakerData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bakerId) {
      fetchData();
    }
  }, [bakerId, router]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">

      </div>
      <div className="grid md:grid-cols-[2fr,1fr] gap-8">
        
        {/* Produkter Sektion - Større del */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div>
            <Link 
              href="/all-bakers" 
              className="inline-flex items-center text-gray-600 hover:text-amber-600 mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-5 mr-2" />
              Tilbage til oversigten
            </Link>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-6 w-6 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-800">Varer fra Bager</h1>
          </div>
          
          {products.length > 0 ? (
            <div className="grid gap-4">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-amber-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <h2 className="text-lg font-semibold text-amber-800 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-600 font-bold text-lg">
                      {product.price} DKK
                    </span>
                    <button className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors duration-200">
                      Tilføj til kurv
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center">Ingen varer tilgængelige.</p>
          )}
        </div>

        {/* Højre kolonne med Åbningstider og Info */}
        <div className="space-y-6">
          {/* Åbningstider boks */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-800">Åbningstider</h2>
            </div>
            {hours.length > 0 ? (
              <div className="space-y-2">
                {hours.map((hour, index) => (
                  <div key={index} className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="font-medium text-gray-700 text-sm">{hour.dayOfWeek}</span>
                    <span className="text-gray-600 text-sm">
                      {hour.openingTime} - {hour.closingTime}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">Kommer snart</p>
            )}
          </div>

          {/* Ny Info boks */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-5 w-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-800">Info</h2>
            </div>
            {baker && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Bager</p>
                    <p className="text-gray-800">{baker.baker_name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Telefon</p>
                    <p className="text-gray-800">{baker.mobile_number}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="text-gray-800">{baker.street}</p>
                    <p className="text-gray-800">{baker.zip_code} {baker.city}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
