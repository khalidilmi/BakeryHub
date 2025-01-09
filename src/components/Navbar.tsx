'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cake, User, Settings, LogOut, Search } from 'lucide-react';



export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  


  return (
    <nav className="bg-amber-100 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Cake className="h-8 w-8 text-amber-600" />
          <span className="text-2xl font-bold text-amber-800">Bakery Portal</span>
        </Link>
      </div>
    </nav>
  );
}
