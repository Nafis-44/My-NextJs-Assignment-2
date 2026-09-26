"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BiTimeFive } from "react-icons/bi";
import { FaFire } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { IWorkout } from '../types/workout';

const LibrarySection = () => {
    const [workouts, setWorkouts] = useState<IWorkout[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('https://api.abcz.workers.dev/api/fitlog')
            .then((res) => res.json())
            .then((data) => {
                setWorkouts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching workouts:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center py-20 text-white">Loading workouts...</div>;
    }

    return (
        <section id="library" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="mb-12">
                <h2 className="text-3xl font-black uppercase tracking-tight text-white">THE LIBRARY</h2>
                <p className="text-zinc-400 text-sm mt-1">Twelve lifts covering every major muscle group.</p>
            </div>

          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {workouts.map((workout: IWorkout) => {
                    const catArray = workout.category ? workout.category.split(',').map((c: string) => c.trim()) : [];
                    
                    
                    const workoutCalories = workout.calories || workout.calories || workout.calories || workout.kcal || '';

                    return (
                        <Link
                            key={workout.id}
                            href={`/workouts/${workout.id}`}
                            className="group bg-[#121212] border border-zinc-800 rounded-2xl overflow-hidden hover:border-[#ccff00] transition-all duration-300 flex flex-col p-4 shadow-xl"
                        >
                            
                            <div className="relative h-48 w-full bg-zinc-900 rounded-xl overflow-hidden mb-4">
                                <Image
                                    src={workout.image}
                                    alt={workout.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                {catArray.map((cat: string, idx: number) => (
                                    <span 
                                        key={idx} 
                                        className="bg-[#ccff00] text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>

                            
                            <h3 className="text-base font-extrabold text-white group-hover:text-[#ccff00] transition-colors uppercase tracking-wide">
                                {workout.name}
                            </h3>

                            
                            <p className="text-xs text-zinc-400 mt-0.5 mb-4">{workout.equipment}</p>

                            
                            <div className="flex items-center gap-6 pt-3 border-t border-zinc-800/80 text-xs text-zinc-300 font-medium mt-auto px-0.5">
                                <div className="flex items-center gap-1.5">
                                    <BiTimeFive className="w-4 h-4 text-zinc-400" />
                                    <span>{workout.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FaFire className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>{workoutCalories} kcal</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                                    <AiFillStar className="w-3.5 h-3.5" />
                                    <span>{workout.rating}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default LibrarySection;