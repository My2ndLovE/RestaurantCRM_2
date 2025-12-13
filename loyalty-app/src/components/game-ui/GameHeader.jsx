import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, color = 'brand-red', subValue }) => {
    // Map simplified color names to Tailwind classes if needed, or use directly
    const colorMap = {
        'brand-red': { border: 'border-red-100', text: 'text-brand-red', track: 'text-red-700' },
        'brand-yellow': { border: 'border-orange-100', text: 'text-brand-yellow', track: 'text-amber-700' },
        'green': { border: 'border-green-100', text: 'text-green-600', track: 'text-green-700' },
        'blue': { border: 'border-blue-100', text: 'text-blue-600', track: 'text-blue-700' },
        'purple': { border: 'border-purple-100', text: 'text-purple-600', track: 'text-purple-700' },
        'gray': { border: 'border-gray-100', text: 'text-gray-600', track: 'text-gray-700' }
    };

    const activeColor = colorMap[color] || colorMap['brand-red'];

    return (
        <div className={`bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-sm border ${activeColor.border} flex items-center gap-2 sm:gap-3 min-w-[80px] sm:min-w-[100px] justify-center`}>
            {icon && <div className={activeColor.text}>{icon}</div>}
            <div className="flex flex-col items-center">
                <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider leading-none mb-0.5">{label}</div>
                <div className={`font-black text-lg sm:text-2xl ${activeColor.text} leading-none`}>
                    {value}
                </div>
                {subValue && (
                    <div className="text-[10px] text-gray-400 leading-none mt-0.5">{subValue}</div>
                )}
            </div>
        </div>
    );
};

const GameHeader = ({ title, icon: Icon, stats = [], onBack, className = '' }) => {
    return (
        <div className={`w-full max-w-2xl mx-auto flex flex-col gap-4 mb-4 sm:mb-6 ${className}`}>
            {/* Stats Row */}
            {stats.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full">
                    {stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GameHeader;
