import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameWrapper from '../game-ui/GameWrapper';
import GameHeader from '../game-ui/GameHeader';
import GameOverlay from '../game-ui/GameOverlay';
import GameButton from '../game-ui/GameButton';
import { Flame } from 'lucide-react';

const FryFlip = ({ onSpinComplete }) => {
    const [gameState, setGameState] = useState('ready');
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [barPosition, setBarPosition] = useState(0);
    const [direction, setDirection] = useState(1);
    const [perfectZoneSize, setPerfectZoneSize] = useState(20);
    const [targetCenter, setTargetCenter] = useState(50);
    const [speed, setSpeed] = useState(2);
    const [lastResult, setLastResult] = useState(null);
    const [combo, setCombo] = useState(0);
    const [isResolving, setIsResolving] = useState(false);
    const hasClaimedRef = useRef(false);
    const animationRef = useRef(null);
    const directionRef = useRef(1);
    const speedRef = useRef(2);
    const scoreRef = useRef(0);
    const isResolvingRef = useRef(false);

    useEffect(() => {
        directionRef.current = direction;
        speedRef.current = speed;
    }, [direction, speed]);

    useEffect(() => {
        isResolvingRef.current = isResolving;
    }, [isResolving]);

    useEffect(() => {
        if (gameState === 'playing') {
            const animate = () => {
                if (!isResolvingRef.current) {
                    setBarPosition(prev => {
                        let newPos = prev + directionRef.current * speedRef.current;
                        if (newPos >= 100) {
                            setDirection(-1);
                            newPos = 100;
                        } else if (newPos <= 0) {
                            setDirection(1);
                            newPos = 0;
                        }
                        return newPos;
                    });
                }
                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [gameState]);

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    const handleComplete = () => {
        onSpinComplete({
            type: 'points',
            value: scoreRef.current,
            label: `${scoreRef.current} Points! (${Math.max(0, Math.round(scoreRef.current / 10))} hits)`
        });
    };

    const autoClaimOnce = () => {
        if (hasClaimedRef.current) return;
        hasClaimedRef.current = true;
        handleComplete();
    };

    const getRandomCenter = (size) => {
        const margin = size;
        return Math.random() * (100 - margin * 2) + margin;
    };

    const startGame = () => {
        setGameState('playing');
        setStreak(0);
        setScore(0);
        setLives(3);
        setCombo(0);
        setIsResolving(false);
        hasClaimedRef.current = false;
        setBarPosition(0);
        setDirection(1);
        setPerfectZoneSize(20);
        setSpeed(2);
        setTargetCenter(getRandomCenter(20));
        setLastResult(null);
    };

    const handleFlip = () => {
        if (gameState !== 'playing' || isResolvingRef.current) return;

        setIsResolving(true);

        const perfectZoneStart = targetCenter - perfectZoneSize / 2;
        const perfectZoneEnd = targetCenter + perfectZoneSize / 2;
        const goodZoneStart = targetCenter - perfectZoneSize;
        const goodZoneEnd = targetCenter + perfectZoneSize;

        let result = 'miss';
        let nextZoneSize = perfectZoneSize;
        let shouldEnd = false;
        let nextLives = lives;

        if (barPosition >= perfectZoneStart && barPosition <= perfectZoneEnd) {
            result = 'perfect';
            setCombo(prev => prev + 1);
        } else if (barPosition >= goodZoneStart && barPosition <= goodZoneEnd) {
            result = 'good';
            setCombo(0);
        } else {
            setCombo(0);
        }

        setLastResult(result);

        if (result === 'miss') {
            setCombo(0);
            setStreak(0);
            nextLives = Math.max(0, lives - 1);
            setLives(nextLives);
            shouldEnd = nextLives === 0;
        } else {
            const newStreak = streak + 1;
            setStreak(newStreak);
            setScore(prev => prev + 10);

            if (newStreak % 3 === 0) {
                nextZoneSize = Math.max(8, perfectZoneSize - 2);
                setPerfectZoneSize(nextZoneSize);
                setSpeed(prev => Math.min(5, prev + 0.3));
            }
        }

        const RESOLVE_DELAY_MS = 650;
        setTimeout(() => {
            setLastResult(null);

            if (shouldEnd) {
                setIsResolving(false);
                endGame();
                return;
            }

            setTargetCenter(getRandomCenter(nextZoneSize));
            setIsResolving(false);
        }, RESOLVE_DELAY_MS);
    };

    const endGame = () => {
        if (gameState === 'finished') return;
        autoClaimOnce();
        setGameState('finished');
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    const perfectZoneStart = targetCenter - perfectZoneSize / 2;
    const perfectZoneEnd = targetCenter + perfectZoneSize / 2;
    const isInPerfectZone = barPosition >= perfectZoneStart && barPosition <= perfectZoneEnd;

    return (
        <GameWrapper title="Fry Flip!">
            {/* Start Screen */}
            <GameOverlay
                isVisible={gameState === 'ready'}
                title="Fry Flip!"
                subtitle="Tap when the bar hits the green zone. You have 3 lives!"
                icon={Flame}
                onPrimaryAction={startGame}
                primaryActionText="START FLIPPING"
            />

            {/* Game Over Screen */}
            <GameOverlay
                isVisible={gameState === 'finished'}
                type="gameover"
                title={streak >= 20 ? 'Amazing!' : streak >= 10 ? 'Great Job!' : 'Good Try!'}
                subtitle={`Streak: ${streak} 🔥`}
                score={score}
                icon={Flame}
                onPrimaryAction={startGame}
                primaryActionText="Play Again"
            />

            {/* Game UI */}
            <GameHeader
                stats={[
                    { label: 'Streak', value: `${streak} 🔥`, color: 'brand-yellow' },
                    { label: 'Lives', value: `${lives} ❤️`, color: 'brand-red' },
                    { label: 'Score', value: score, color: 'green' },
                    { label: 'Combo', value: combo > 0 ? `${combo}x` : '—', color: 'green' }
                ]}
            />

            <div className="w-full max-w-md mx-auto px-2">
                {/* Timing Bar */}
                <div className="mb-6 sm:mb-8">
                    <div className="relative h-20 sm:h-24 bg-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner border-4 border-white">
                        {/* Good Zone */}
                        <div
                            className="absolute top-0 h-full bg-yellow-200/80"
                            style={{
                                left: `${targetCenter - perfectZoneSize}%`,
                                width: `${perfectZoneSize * 2}%`
                            }}
                        />

                        {/* Perfect Zone */}
                        <div
                            className="absolute top-0 h-full bg-green-400"
                            style={{
                                left: `${targetCenter - perfectZoneSize / 2}%`,
                                width: `${perfectZoneSize}%`
                            }}
                        >
                            <div className="h-full flex items-center justify-center text-white font-bold text-xs sm:text-sm drop-shadow">
                                PERFECT
                            </div>
                        </div>

                        {/* Moving Bar */}
                        <motion.div
                            className="absolute top-0 h-full w-1.5 bg-brand-red shadow-lg z-10"
                            style={{ left: `${barPosition}%` }}
                            animate={{
                                boxShadow: isInPerfectZone
                                    ? '0 0 15px rgba(239, 68, 68, 0.8)'
                                    : '0 0 8px rgba(239, 68, 68, 0.4)'
                            }}
                        />
                    </div>
                </div>

                {/* Fry Animation */}
                <div className="text-center mb-8 relative h-28 flex items-center justify-center">
                    <motion.div
                        className="text-7xl inline-block"
                        animate={{ rotateY: [0, 180, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        🍟
                    </motion.div>

                    {/* Feedback */}
                    <AnimatePresence>
                        {lastResult && (
                            <motion.div
                                initial={{ scale: 0, y: 0 }}
                                animate={{ scale: 1, y: -40 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap z-20"
                            >
                                {lastResult === 'perfect' && (
                                    <div className="text-green-500 text-4xl font-black drop-shadow-xl border-white text-stroke-2">
                                        ⭐ PERFECT!
                                    </div>
                                )}
                                {lastResult === 'good' && (
                                    <div className="text-yellow-500 text-3xl font-black drop-shadow-xl">
                                        ✓ GOOD!
                                    </div>
                                )}
                                {lastResult === 'miss' && (
                                    <div className="text-red-500 text-3xl font-black drop-shadow-xl">
                                        ✗ MISS!
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Flip Button */}
                <GameButton
                    onClick={handleFlip}
                    fullWidth
                    size="xl"
                    disabled={gameState !== 'playing' || isResolving}
                    className="active:bg-red-700 shadow-2xl"
                >
                    FLIP!
                </GameButton>
            </div>
        </GameWrapper>
    );
};

export default FryFlip;
