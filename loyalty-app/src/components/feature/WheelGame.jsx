import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const SEGMENTS = [
    { id: 1, label: '10 Pts', color: '#FFC107', value: 10, type: 'points' },
    { id: 2, label: 'Free Drink', color: '#4CAF50', value: 'drink', type: 'voucher' },
    { id: 3, label: '50 Pts', color: '#FFC107', value: 50, type: 'points' },
    { id: 4, label: 'Try Again', color: '#9E9E9E', value: 0, type: 'loss' },
    { id: 5, label: '20 Pts', color: '#FFC107', value: 20, type: 'points' },
    { id: 6, label: '$5 Off', color: '#4CAF50', value: '5off', type: 'voucher' },
];

const WheelGame = ({ onSpinComplete }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const controls = useAnimation();

    const handleSpin = async () => {
        if (isSpinning) return;
        setIsSpinning(true);

        // Random rotation between 5 and 10 full spins (1800 - 3600 degrees)
        // plus a random offset to land on a segment
        const randomRotation = 1800 + Math.random() * 1800;

        await controls.start({
            rotate: randomRotation,
            transition: {
                duration: 4,
                ease: [0.2, 0.8, 0.2, 1], // Custom cubic bezier for "spin up and slow down" feel
            }
        });

        // Calculate result based on rotation
        // This is a simplified calculation. In a real app, backend determines result first.
        const normalizedRotation = randomRotation % 360;
        const segmentAngle = 360 / SEGMENTS.length;
        // 0 degrees is at 3 o'clock in CSS rotation, but our pointer is at top (12 o'clock)
        // We need to adjust logic or just pick a random result for demo.

        // For demo simplicity: Pick a random result
        const result = SEGMENTS[Math.floor(Math.random() * SEGMENTS.length)];

        setIsSpinning(false);
        onSpinComplete(result);

        // Reset rotation for next spin (optional, or keep accumulating)
        // controls.set({ rotate: randomRotation % 360 }); 
    };

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-72 h-72">
                {/* Pointer */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-brand-text drop-shadow-lg">
                    <ArrowDown size={40} fill="currentColor" />
                </div>

                {/* Wheel */}
                <motion.div
                    className="w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden relative bg-white"
                    animate={controls}
                    style={{ rotate: 0 }}
                >
                    {SEGMENTS.map((segment, index) => {
                        const rotation = (360 / SEGMENTS.length) * index;
                        return (
                            <div
                                key={segment.id}
                                className="absolute w-1/2 h-full top-0 right-0 origin-left flex items-center justify-center"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    backgroundColor: segment.color,
                                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 50%)', // Rough slice shape, better with SVG
                                }}
                            >
                                {/* Text needs to be counter-rotated or positioned carefully */}
                                <span
                                    className="absolute right-8 font-bold text-white text-sm whitespace-nowrap"
                                    style={{ transform: 'rotate(0deg)' }} // Adjust text rotation if needed
                                >
                                    {segment.label}
                                </span>
                            </div>
                        );
                    })}

                    {/* Better SVG Wheel Implementation for cleaner slices */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                        {SEGMENTS.map((segment, index) => {
                            const angle = 360 / SEGMENTS.length;
                            const startAngle = index * angle;
                            const endAngle = (index + 1) * angle;

                            // Convert polar to cartesian
                            const startRad = (startAngle - 90) * Math.PI / 180;
                            const endRad = (endAngle - 90) * Math.PI / 180;
                            const x1 = 50 + 50 * Math.cos(startRad);
                            const y1 = 50 + 50 * Math.sin(startRad);
                            const x2 = 50 + 50 * Math.cos(endRad);
                            const y2 = 50 + 50 * Math.sin(endRad);

                            return (
                                <path
                                    key={segment.id}
                                    d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`}
                                    fill={segment.color}
                                    stroke="white"
                                    strokeWidth="0.5"
                                />
                            );
                        })}
                    </svg>

                    {/* Labels on top of SVG */}
                    {SEGMENTS.map((segment, index) => {
                        const angle = 360 / SEGMENTS.length;
                        const midAngle = index * angle + angle / 2;
                        const rad = (midAngle - 90) * Math.PI / 180;
                        // Position text at 70% radius
                        const x = 50 + 35 * Math.cos(rad);
                        const y = 50 + 35 * Math.sin(rad);

                        return (
                            <div
                                key={`label-${segment.id}`}
                                className="absolute w-full h-full top-0 left-0 pointer-events-none"
                            >
                                <span
                                    className="absolute text-[10px] font-bold text-white text-center w-12"
                                    style={{
                                        left: `${x}%`,
                                        top: `${y}%`,
                                        transform: `translate(-50%, -50%) rotate(${midAngle + 90}deg)`, // Rotate text to face center
                                    }}
                                >
                                    {segment.label}
                                </span>
                            </div>
                        );
                    })}

                </motion.div>

                {/* Center Cap */}
                <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md z-10 flex items-center justify-center">
                    <div className="w-8 h-8 bg-brand-red rounded-full"></div>
                </div>
            </div>

            <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="mt-12 bg-brand-text text-white font-bold py-4 px-12 rounded-full shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all text-lg tracking-wide"
            >
                {isSpinning ? 'Spinning...' : 'SPIN NOW'}
            </button>
        </div>
    );
};

export default WheelGame;
