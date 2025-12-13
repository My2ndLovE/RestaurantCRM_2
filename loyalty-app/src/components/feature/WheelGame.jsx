import React, { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import GameWrapper from '../game-ui/GameWrapper';
import GameButton from '../game-ui/GameButton';
import GameOverlay from '../game-ui/GameOverlay';
import { Gift } from 'lucide-react';

const SEGMENTS = [
    { label: '50 Pts', value: 50, type: 'points', color: '#EF4444' },
    { label: 'Free Fry', value: 'fry', type: 'item', color: '#F59E0B' },
    { label: '20 Pts', value: 20, type: 'points', color: '#10B981' },
    { label: 'No Luck', value: 0, type: 'loss', color: '#6B7280' },
    { label: '100 Pts', value: 100, type: 'points', color: '#3B82F6' },
    { label: 'Free Drink', value: 'drink', type: 'item', color: '#8B5CF6' },
];

const WheelGame = ({ onSpinComplete }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const hasClaimedRef = useRef(false);
    const controls = useAnimation();

    const handleSpin = async () => {
        if (!hasStarted || isSpinning) return;
        setIsSpinning(true);
        setResult(null);
        hasClaimedRef.current = false;

        // Random rotation between 5 and 10 full spins plus random segment alignment
        const randomRotation = 1800 + Math.random() * 1800;

        await controls.start({
            rotate: randomRotation,
            transition: { duration: 4, type: 'spring', stiffness: 50, damping: 20 } // Physics-based ease-out
        });

        const normalizedRotation = randomRotation % 360;
        const segmentAngle = 360 / SEGMENTS.length;
        // Calculate winning index based on pointer being at the top (0 degrees)
        // Wheel rotates clockwise, so we subtract rotation from 360
        const winningIndex = Math.floor(((360 - normalizedRotation + segmentAngle / 2) % 360) / segmentAngle);

        const winningSegment = SEGMENTS[winningIndex];
        setResult(winningSegment);

        autoClaimOnce(winningSegment);

        setTimeout(() => {
            setIsSpinning(false);
        }, 500);
    };

    const resetGame = () => {
        setResult(null);
        controls.set({ rotate: 0 });
    };

    const startGame = () => {
        setHasStarted(true);
        resetGame();
    };

    const autoClaimOnce = (segment) => {
        if (!segment || hasClaimedRef.current) return;
        hasClaimedRef.current = true;
        onSpinComplete(segment);
    };

    return (
        <GameWrapper title="Flavor Spin">
            <GameOverlay
                isVisible={!hasStarted}
                title="Flavor Spin"
                subtitle="Spin the wheel to win points and prizes."
                icon={Gift}
                onPrimaryAction={startGame}
                primaryActionText="START SPIN"
            />

            <GameOverlay
                isVisible={!!result && !isSpinning}
                type="gameover" // Reusing gameover style for result
                title={result?.type === 'loss' ? 'Better luck next time!' : 'You Won!'}
                subtitle={result?.label}
                score={result?.type === 'points' ? result.value : undefined}
                icon={Gift}
                onPrimaryAction={resetGame}
                primaryActionText="Spin Again"
            />

            <div className="flex flex-col items-center justify-center py-6 sm:py-12">
                {/* Wheel Container */}
                <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-20">
                        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-brand-red filter drop-shadow-lg" />
                    </div>

                    {/* Wheel */}
                    <motion.div
                        className="w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden relative bg-white"
                        animate={controls}
                        style={{ rotate: 0 }}
                    >
                        {SEGMENTS.map((segment, index) => {
                            const rotation = (index * 360) / SEGMENTS.length;
                            return (
                                <div
                                    key={index}
                                    className="absolute w-1/2 h-[50%] top-0 left-1/2 origin-bottom-left"
                                    style={{
                                        transform: `rotate(${rotation}deg) skewY(-30deg)`, // Skew needed for correct slice shape logic depending on N segments
                                        // Simple CSS conic gradients are easier for perfect slices, but let's stick to this or SVG if we want complex content.
                                        // For 6 segments, specific clip-paths or SVGs are better.
                                        // Let's use a simpler SVG approach inside the motion div for perfect rendering.
                                    }}
                                >
                                </div>
                            );
                        })}

                        {/* SVG Wheel for perfect rendering */}
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90">
                            {SEGMENTS.map((segment, index) => {
                                const startAngle = (index * 360) / SEGMENTS.length;
                                const endAngle = ((index + 1) * 360) / SEGMENTS.length;

                                // Coordinates for arc
                                const x1 = 50 + 50 * Math.cos(Math.PI * startAngle / 180);
                                const y1 = 50 + 50 * Math.sin(Math.PI * startAngle / 180);
                                const x2 = 50 + 50 * Math.cos(Math.PI * endAngle / 180);
                                const y2 = 50 + 50 * Math.sin(Math.PI * endAngle / 180);

                                return (
                                    <g key={index}>
                                        <path
                                            d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`}
                                            fill={segment.color}
                                            stroke="white"
                                            strokeWidth="2"
                                        />
                                        <text
                                            x={50 + 32 * Math.cos(Math.PI * (startAngle + 30) / 180)} // Offset for text
                                            y={50 + 32 * Math.sin(Math.PI * (startAngle + 30) / 180)}
                                            fill="white"
                                            fontSize="6" // Small font size for SVG scale
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            alignmentBaseline="middle"
                                            transform={`rotate(${startAngle + 30}, ${50 + 32 * Math.cos(Math.PI * (startAngle + 30) / 180)}, ${50 + 32 * Math.sin(Math.PI * (startAngle + 30) / 180)}) translate(0,0)`} // Simple rotation
                                            style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
                                        >
                                            {segment.label}
                                        </text>
                                    </g>
                                )
                            })}
                        </svg>

                        {/* Center Cap */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-inner flex items-center justify-center z-10 border-4 border-gray-100">
                            <div className="font-black text-brand-red text-xl">SPIN</div>
                        </div>
                    </motion.div>

                    {/* Shadow */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-black/20 blur-xl rounded-full"></div>
                </div>

                <div className="mt-16">
                    <GameButton
                        onClick={handleSpin}
                        disabled={!hasStarted || isSpinning}
                        size="xl"
                        className="shadow-2xl active:translate-y-1"
                    >
                        {isSpinning ? 'SPINNING...' : 'SPIN NOW!'}
                    </GameButton>
                </div>
            </div>
        </GameWrapper >
    );
};

export default WheelGame;
