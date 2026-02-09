"use client";

import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-1xl uppercase tracking-wider font-light bg-gradient-to-r from-emerald-600 to-purple-600 bg-clip-text text-transparent">
            SurfOnboard AI
          </div>
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-normal text-gray-700 hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <Link href="/storytelling" className="text-sm  font-normal text-gray-700 hover:text-emerald-600 transition-colors">
            Storytelling
          </Link>
          <Link href="/storytelling/dashboard" className="text-sm font-normal text-gray-700 hover:text-emerald-600 transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
