"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BiArrowBack } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";
import { FaPlus, FaBookmark } from "react-icons/fa";
import { IWorkout } from '../../types/workout';
import { toast } from 'react-toastify';

const WorkoutDetailsPage = () => {
    const params = useParams();
    const id = params?.id;

    const [workout, setWorkout] = useState<IWorkout | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchWorkoutDetails = async () => {
            try {
                const res = await fetch(`https://api.abcz.workers.dev/api/fitlog`);
                if (!res.ok) {
                    throw new Error("Failed to fetch workouts");
                }
                const data = await res.json();
                const matchedWorkout = data.find((item: IWorkout) => String(item.id) === String(id));
                
                if (matchedWorkout) {
                    setWorkout(matchedWorkout);
                } else {
                    setError("Workout not found.");
                }
            } catch (err) {
                console.error("Error fetching workouts:", err);
                setError("Could not load workout details.");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkoutDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <div className="animate-pulse text-lg font-bold">Loading workout details...</div>
            </div>
        );
    }

    if (error || !workout) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white gap-4">
                <p className="text-red-500 font-semibold">{error || "Workout not found"}</p>
                <Link href="/" className="px-4 py-2 bg-[#ccff00] text-black font-bold rounded-xl text-sm">
                    Back to Home
                </Link>
            </div>
        );
    }

    const getCategories = (): string[] => {
        if (workout.muscleGroups && Array.isArray(workout.muscleGroups)) {
            return workout.muscleGroups;
        }
        return [];
    };

    const catArray = getCategories();

   
    const handleAddToPlan = () => {
        const existing = JSON.parse(localStorage.getItem('todayPlans') || '[]');
        
        const formattedItem = {
            id: String(workout.id),
            title: workout.name,
            category: catArray[0] || workout.difficulty || 'General',
            duration: Number(workout.duration) || 25,
            calories: Number(workout.caloriesBurned) || Number(workout.calories) || 180,
            rating: Number(workout.rating) || 4.8,
            image: workout.image,
            isCompleted: false
        };

        if (!existing.some((item: IWorkout) => String(item.id) === String(formattedItem.id))) {
            const updated = [...existing, formattedItem];
            localStorage.setItem('todayPlans', JSON.stringify(updated));
            toast.success("Added to today's plan");
        } else {
            toast.info("Already in today's plan!");
        }
    };

    
    const handleSaveForLater = () => {
        const existing = JSON.parse(localStorage.getItem('savedPlans') || '[]');
        
        const formattedItem = {
            id: String(workout.id),
            title: workout.name,
            category: catArray[0] || workout.difficulty || 'General',
            duration: Number(workout.duration) || 25,
            calories: Number(workout.caloriesBurned) || Number(workout.calories) || 180,
            rating: Number(workout.rating) || 4.8,
            image: workout.image
        };

        if (!existing.some((item: IWorkout) => String(item.id) === String(formattedItem.id))) {
            const updated = [...existing, formattedItem];
            localStorage.setItem('savedPlans', JSON.stringify(updated));
            toast.success("Workout saved for later");
        } else {
            toast.info("Already saved!");
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white py-10 px-4 md:px-12 lg:px-20 relative">
            <div className="max-w-5xl mx-auto mb-6">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#ccff00] transition-colors font-medium"
                >
                    <BiArrowBack className="w-4 h-4" /> Back to Library
                </Link>
            </div>

            <div className="max-w-5xl mx-auto bg-[#121212] border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <div className="lg:col-span-6">
                    <div className="relative h-85 md:h-112 w-full bg-zinc-900 rounded-2xl overflow-hidden shadow-inner">
                        <Image
                            src={workout.image}
                            alt={workout.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                <div className="lg:col-span-6 flex flex-col">
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2">
                        {workout.name}
                    </h1>

                    {workout.description && (
                        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-4">
                            {workout.description}
                        </p>
                    )}

                    {catArray.length > 0 && (
                        <div className="flex items-center gap-3 mb-6 flex-wrap">
                            {catArray.map((cat, idx) => (
                                <span 
                                    key={idx} 
                                    className="bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold text-xs px-6 py-2 rounded-full uppercase tracking-wider shadow-md transition-all inline-block text-center cursor-default"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="space-y-3 mb-8 border-t border-zinc-800/80 pt-4">
                        <div className="flex justify-between items-center py-2.5 border-b border-zinc-800/50 text-sm">
                            <span className="text-zinc-400 uppercase tracking-wider text-xs font-bold">EQUIPMENT</span>
                            <span className="text-zinc-200 font-semibold text-xs md:text-sm">{workout.equipment || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 border-b border-zinc-800/50 text-sm">
                            <span className="text-zinc-400 uppercase tracking-wider text-xs font-bold">DIFFICULTY</span>
                            <span className="text-zinc-200 font-semibold text-xs md:text-sm">{workout.difficulty || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 border-b border-zinc-800/50 text-sm">
                            <span className="text-zinc-400 uppercase tracking-wider text-xs font-bold">SETS</span>
                            <span className="text-zinc-200 font-semibold text-xs md:text-sm">{workout.sets || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 border-b border-zinc-800/50 text-sm">
                            <span className="text-zinc-400 uppercase tracking-wider text-xs font-bold">REPS</span>
                            <span className="text-zinc-200 font-semibold text-xs md:text-sm">{workout.reps || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 border-b border-zinc-800/50 text-sm">
                            <span className="text-zinc-400 uppercase tracking-wider text-xs font-bold">DURATION</span>
                            <span className="text-zinc-200 font-semibold text-xs md:text-sm">{workout.duration ? `${workout.duration} min` : 'N/A'}</span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 border-b border-zinc-800/50 text-sm">
                            <span className="text-zinc-400 uppercase tracking-wider text-xs font-bold">CALORIES</span>
                            <span className="text-zinc-200 font-semibold text-xs md:text-sm">
                                {workout.caloriesBurned ? `${workout.caloriesBurned} kcal` : 'N/A'}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 text-sm">
                            <span className="text-zinc-400 uppercase tracking-wider text-xs font-bold">RATING</span>
                            <span className="text-zinc-200 font-semibold text-xs md:text-sm flex items-center gap-1">
                                <AiFillStar className="text-amber-400 w-4 h-4" /> {workout.rating || 'N/A'}
                            </span>
                        </div>
                    </div>

                    {workout.instructions && workout.instructions.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">INSTRUCTIONS</h3>
                            <ol className="space-y-2.5">
                                {workout.instructions.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3 bg-zinc-900/40 border border-zinc-800/50 p-3 rounded-xl text-xs">
                                        <span className="flex items-center justify-center bg-zinc-800 text-zinc-300 font-bold text-[10px] w-5 h-5 rounded-full shrink-0 mt-0.5 border border-zinc-700">
                                            {index + 1}
                                        </span>
                                        <p className="text-zinc-300 leading-relaxed">{step}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button 
                            onClick={handleAddToPlan}
                            className="flex-1 bg-[#ccff00] hover:bg-[#b3e600] text-black font-extrabold text-xs md:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow-md"
                        >
                            <FaPlus className="w-3.5 h-3.5" /> Add to Todays Plan
                        </button>

                        <button 
                            onClick={handleSaveForLater}
                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs md:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider border border-zinc-700"
                        >
                            <FaBookmark className="w-3.5 h-3.5 text-[#ccff00]" /> Save for Later
                        </button>
                    </div>

                </div>

            </div>
        </main>
    );
};

export default WorkoutDetailsPage;