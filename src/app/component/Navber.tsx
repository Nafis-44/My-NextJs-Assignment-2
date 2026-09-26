'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const today = JSON.parse(localStorage.getItem('todayPlans') || '[]');
      const saved = JSON.parse(localStorage.getItem('savedPlans') || '[]');
      setPlanCount(today.length);
      setSavedCount(saved.length);
    };

    updateCounts();
    window.addEventListener('storage', updateCounts);
    const interval = setInterval(updateCounts, 500);

    return () => {
      window.removeEventListener('storage', updateCounts);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="bg-[#121212] border-b border-zinc-800 px-6 py-4 flex items-center justify-between text-white sticky top-0 z-50">
      <div className='flex items-center gap-2'>
        <Image
          src="/logo.png"
          alt='Fitlog'
          width={30}
          height={30} />
        <h1 className='text-white font-black  text-lg'>FITLOG</h1>

      </div>
      <div className="flex items-center gap-8 text-sm">
        <Link
          href="/"
          className={`transition-colors ${pathname === '/' ? 'text-[#ccff00] font-semibold' : 'text-zinc-400 hover:text-white'}`}
        >
          Workouts
        </Link>
        <Link
          href="/my-plan"
          className={`transition-colors ${pathname === '/my-plan' ? 'text-[#ccff00] font-semibold' : 'text-zinc-400 hover:text-white'}`}
        >
          My Plan
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/my-plan" className="flex items-center gap-2 bg-[#ccff00] text-black px-3.5 py-1.5 rounded-full text-xs font-bold transition-transform hover:scale-105">
          <span>Plan</span>
          <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
            {planCount}
          </span>
        </Link>

        <Link href="/my-plan" className="flex items-center gap-2 border border-zinc-700 bg-transparent text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors hover:border-zinc-500">
          <span>Saved</span>
          <span className="bg-zinc-800 text-[#ccff00] w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
            {savedCount}
          </span>
        </Link>
      </div>
    </nav>
  );
}

