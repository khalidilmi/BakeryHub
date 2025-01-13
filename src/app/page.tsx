import Link from 'next/link';
import { Store, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Velkommen til Bageri Portalen
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Din direkte forbindelse til lokale bagerier og friskbagte varer
          </p>
        </div>

        {}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {}
          <Link href="/userlogin" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center group-hover:-translate-y-1">
              <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <User className="h-10 w-10 text-amber-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Er du bruger?
              </h2>
              <p className="text-gray-600 mb-6">
                Log ind for at se udvalget hos dine lokale bagerier og gem dine favoritter
              </p>
              <span className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">
                Log ind som bruger
              </span>
            </div>
          </Link>

          {}
          <Link href="/login" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center group-hover:-translate-y-1">
              <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <Store className="h-10 w-10 text-amber-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Er du bager?
              </h2>
              <p className="text-gray-600 mb-6">
                Log ind for at administrere dine produkter og nå ud til flere kunder
              </p>
              <span className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">
                Log ind som bager
              </span>
            </div>
          </Link>
        </div>

        {}
        <div className="text-center mt-16">
          <p className="text-gray-600">
            Ny på platformen?{' '}
            <Link href="/userlogin" className="text-amber-600 hover:text-amber-700 font-medium">
              Opret en konto her som bruger 
            </Link>
          </p>
        </div>
        <div className="text-center mt-16">
          <p className="text-gray-600">
            Ny på platformen?{' '}
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Opret en konto her som bager
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
