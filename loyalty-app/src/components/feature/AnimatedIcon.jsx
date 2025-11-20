import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable animated icon wrapper using Framer Motion
 * Provides various animation presets for icons
 */
const AnimatedIcon = ({
    children,
    animation = 'bounce',
    size = 'md',
    className = ''
}) => {
    const animations = {
        bounce: {
            initial: { scale: 0 },
            animate: {
                scale: [0, 1.2, 1],
                rotate: [0, 10, -10, 0]
            },
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        pulse: {
            animate: {
                scale: [1, 1.1, 1],
            },
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
            }
        },
        spin: {
            animate: {
                rotate: 360
            },
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: "linear"
            }
        },
        shake: {
            animate: {
                x: [0, -10, 10, -10, 10, 0],
            },
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            }
        },
        float: {
            animate: {
                y: [0, -10, 0],
            },
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        },
        pop: {
            initial: { scale: 0, opacity: 0 },
            animate: {
                scale: 1,
                opacity: 1
            },
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 15
            }
        }
    };

    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    const animationProps = animations[animation] || animations.bounce;

    return (
        <motion.div
            className={`inline-flex items-center justify-center ${sizes[size]} ${className}`}
            {...animationProps}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedIcon;
