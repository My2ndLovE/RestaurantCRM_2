import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const GameWrapper = ({ children, title, onBack, className = '', theme = 'neutral' }) => {
    // Theme backgrounds could be expanded
    const themes = {
        neutral: "from-blue-50 to-purple-50",
        warm: "from-orange-50 to-amber-50",
        cool: "from-sky-50 to-emerald-50",
    };

    const bgGradient = themes[theme] || themes.neutral;

    return (
        <div className={`flex flex-col items-center justify-start sm:justify-center p-3 sm:p-6 min-h-[calc(100svh-10rem)] sm:min-h-[600px] w-full relative ${className}`}>
             {/* Back Button positioned absolutely at top left of the container area if needed, 
                 but typically it's handled outside or in a top bar. 
                 If we want it inside: */}
            {onBack && (
                <div className="absolute top-0 left-2 sm:left-4 z-10">
                     <button
                        onClick={onBack}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                </div>
            )}
            
            <div className="w-full max-w-4xl mx-auto">
                 {/* Title if provided and not handled by GameHeader */}
                 {title && (
                    <motion.h2 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hidden sm:block text-center text-2xl sm:text-3xl font-black text-brand-text mb-6 drop-shadow-sm"
                    >
                        {title}
                    </motion.h2>
                 )}

                {children}
            </div>
        </div>
    );
};

export default GameWrapper;
