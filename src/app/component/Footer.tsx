import Image from 'next/image';
import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#121212] border-t border-zinc-800 py-6 px-6 md:px-12 mt-20">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Logo / Brand Name */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="FitLog Logo"
                        width={36}
                        height={36}
                        className="h-9 w-auto object-contain"
                    />
                    <span className="text-white font-bold text-sm tracking-wider">FITLOG</span>
                </div>

                {/* Copyright Text */}
                <p className="text-zinc-400 text-xs text-center sm:text-right">
                    © 2026 FitLog — Workout Library. Train hard, log honest.
                </p>
            </div>
        </footer>
    );
};

export default Footer;