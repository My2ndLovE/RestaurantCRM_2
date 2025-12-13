import React from 'react';
import { motion } from 'framer-motion';

const GameButton = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    fullWidth = false
}) => {
    const baseStyles = "font-bold rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 touch-manipulation flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-brand-red text-white hover:bg-red-600",
        secondary: "bg-brand-yellow text-brand-text hover:bg-yellow-400",
        outline: "bg-white border-2 border-brand-red text-brand-red hover:bg-red-50",
        neutral: "bg-white text-brand-text hover:bg-gray-100 border border-gray-200"
    };

    const sizes = {
        sm: "py-2 px-4 text-xs sm:text-sm",
        md: "py-3 px-8 text-sm sm:text-base",
        lg: "py-4 px-10 text-base sm:text-lg tracking-wide",
        xl: "py-4 sm:py-5 px-12 text-lg sm:text-xl tracking-wide",
        icon: "p-2 sm:p-3"
    };

    return (
        <motion.button
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={onClick}
            disabled={disabled}
            className={`
                ${baseStyles}
                ${variants[variant] || variants.primary}
                ${sizes[size] || sizes.md}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
        >
            {children}
        </motion.button>
    );
};

export default GameButton;
