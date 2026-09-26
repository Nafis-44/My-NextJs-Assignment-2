'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaStar, FaTrash, FaCheck } from 'react-icons/fa';
import Image from 'next/image';


interface Workout {
  id: string;
  title: string;
  category: string;
  duration: number;
  calories: number;
  rating: number;
  image?: string;
  isCompleted?: boolean;
}

export default function MyPlanPage() {
  const [activeTab, setActiveTab] = useState<'today' | 'saved'>('today');
  const [sortBy, setSortBy] = useState<'duration' | 'calories' | 'rating'>('duration');
  const [isLoading, setIsLoading] = useState(true);
  
  const [todayPlans, setTodayPlans] = useState<Workout[]>([]);
  const [savedPlans, setSavedPlans] = useState<Workout[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedToday = localStorage.getItem('todayPlans');
      const storedSaved = localStorage.getItem('savedPlans');

      if (storedToday) {
        try { setTodayPlans(JSON.parse(storedToday)); } catch (e) { console.error(e); }
      }
      if (storedSaved) {
        try { setSavedPlans(JSON.parse(storedSaved)); } catch (e) { console.error(e); }
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const currentList = activeTab === 'today' ? todayPlans : savedPlans;
  const totalExercises = currentList.length;
  const totalMinutes = currentList.reduce((acc, curr) => acc + curr.duration, 0);
  const totalCalories = currentList.reduce((acc, curr) => acc + curr.calories, 0);

  const sortedList = [...currentList].sort((a, b) => {
    if (sortBy === 'duration') return a.duration - b.duration;
    if (sortBy === 'calories') return a.calories - b.calories;
    return b.rating - a.rating;
  });

  const handleRemove = (id: string) => {
    if (activeTab === 'today') {
      const updated = todayPlans.filter(item => item.id !== id);
      setTodayPlans(updated);
      localStorage.setItem('todayPlans', JSON.stringify(updated));
    } else {
      const updated = savedPlans.filter(item => item.id !== id);
      setSavedPlans(updated);
      localStorage.setItem('savedPlans', JSON.stringify(updated));
    }
    showToast("Workout removed successfully!");
  };

  const handleToggleComplete = (id: string) => {
    if (activeTab === 'today') {
      const updated = todayPlans.map(item => 
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      );
      setTodayPlans(updated);
      localStorage.setItem('todayPlans', JSON.stringify(updated));
      showToast("Workout marked as done!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <p className="text-[#ccff00] tracking-widest text-sm animate-pulse">LOADING WORKOUTS…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-white px-6 py-8 relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#ccff00] text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg z-50 transition-all">
          {toastMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-wide uppercase mb-1">MY PLAN</h1>
        <p className="text-zinc-400 text-sm mb-8">
          {activeTab === 'today' 
            ? "Cap of five lifts for today. Finish them, then load more."
            : "Your saved workouts list for later."}
        </p>

        <div className="grid grid-cols-3 gap-4 bg-[#1a1a1a] p-6 rounded-xl border border-zinc-800 mb-8 text-center">
          <div>
            <p className="text-zinc-400 text-xs uppercase mb-1">Exercises</p>
            <p className="text-2xl font-bold text-[#ccff00]">{totalExercises}</p>
          </div>
          <div>
            <p className="text-zinc-400 text-xs uppercase mb-1">Minutes</p>
            <p className="text-2xl font-bold text-white">{totalMinutes}</p>
          </div>
          <div>
            <p className="text-zinc-400 text-xs uppercase mb-1">Calories</p>
            <p className="text-2xl font-bold text-white">{totalCalories}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-zinc-800 pb-4 gap-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('today')}
              className={`font-semibold pb-1 transition-colors ${
                activeTab === 'today' ? 'text-white border-b-2 border-[#ccff00]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Todays Plan
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`font-semibold pb-1 transition-colors ${
                activeTab === 'saved' ? 'text-white border-b-2 border-[#ccff00]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Saved
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "duration" | "calories" | "rating")}
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white focus:outline-none"
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {sortedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl font-bold tracking-widest text-zinc-300 mb-2">NOTHING HERE YET</h2>
            <p className="text-zinc-500 text-sm mb-6">Browse the library and add a lift to get today moving.</p>
            <Link
              href="/"
              className="bg-[#ccff00] text-black font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-all"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedList.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#1a1a1a] border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-24 h-16 bg-zinc-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-zinc-500 text-xs">
                    {item.image ? (
                      <Image src={item.image} alt={item.title} width={20} height={200} className="w-full h-full object-cover" />
                    )
                    : (
                      <span>Image</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide">{item.title}</h3>
                    <p className="text-xs text-zinc-400 mb-2">{item.category}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span>⏱ {item.duration} min</span>
                      <span>🔥 {item.calories} kcal</span>
                      <span className="flex items-center gap-1 text-[#ccff00]">
                        <FaStar size={10} /> {item.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <Link
                    href={`/workouts/${item.id}`}
                    className="text-xs border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-full text-zinc-300 transition-colors"
                  >
                    View Details
                  </Link>
                  
                  {activeTab === 'today' && (
                    <button
                      onClick={() => handleToggleComplete(item.id)}
                      className={`text-xs font-medium px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 ${
                        item.isCompleted 
                          ? 'bg-green-600 text-white' 
                          : 'bg-[#ccff00] hover:opacity-90 text-black'
                      }`}
                    >
                      {item.isCompleted ? <><FaCheck size={10} /> Done</> : 'Mark as Done'}
                    </button>
                  )}

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-zinc-500 hover:text-red-400 p-2 transition-colors"
                    title="Remove"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}