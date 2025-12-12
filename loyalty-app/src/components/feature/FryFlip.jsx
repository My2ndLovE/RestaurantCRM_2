import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const animationRef = useRef(null);
    const directionRef = useRef(1);
    const speedRef = useRef(2);
    const scoreRef = useRef(0);

    useEffect(() => {
        directionRef.current = direction;
        speedRef.current = speed;
    }, [direction, speed]);

    useEffect(() => {
        if (gameState === 'playing') {
            const animate = () => {
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
        setBarPosition(0);
        setDirection(1);
        setPerfectZoneSize(20);
        setSpeed(2);
        setTargetCenter(getRandomCenter(20));
        setLastResult(null);
    };

    const handleFlip = () => {
        if (gameState !== 'playing') return;

        const perfectZoneStart = targetCenter - perfectZoneSize / 2;
        const perfectZoneEnd = targetCenter + perfectZoneSize / 2;
        const goodZoneStart = targetCenter - perfectZoneSize;
        const goodZoneEnd = targetCenter + perfectZoneSize;

        let result = 'miss';
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
        setTimeout(() => setLastResult(null), 600);

        if (result === 'miss') {
            setCombo(0);
            setStreak(0);
            setLives(prev => {
                const next = Math.max(0, prev - 1);
                if (next === 0) {
                    setTimeout(() => endGame(), 400);
                } else {
                    setTargetCenter(getRandomCenter(perfectZoneSize));
                }
                return next;
            });
            return;
        }

        const newStreak = streak + 1;
        setStreak(newStreak);
        setScore(prev => prev + 10);

        let nextZoneSize = perfectZoneSize;
        if (newStreak % 3 === 0) {
            nextZoneSize = Math.max(8, perfectZoneSize - 2);
            setPerfectZoneSize(nextZoneSize);
            setSpeed(prev => Math.min(5, prev + 0.3));
        }

        setTargetCenter(getRandomCenter(nextZoneSize));
    };

    const endGame = () => {
        if (gameState === 'finished') return;
        setGameState('finished');
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        setTimeout(() => {
            onSpinComplete({
                type: 'points',
                value: scoreRef.current,
                label: `${scoreRef.current} Points! (${Math.max(0, Math.round(scoreRef.current / 10))} hits)`
            });
        }, 1000);
    };

    const perfectZoneStart = targetCenter - perfectZoneSize / 2;
    const perfectZoneEnd = targetCenter + perfectZoneSize / 2;
    const isInPerfectZone = barPosition >= perfectZoneStart && barPosition <= perfectZoneEnd;

    return (
        <div className="flex flex-col items-center justify-center p-3 sm:p-6 min-h-[550px]">
            {gameState === 'ready' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center px-4"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-text mb-3 sm:mb-4">Fry Flip!</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">Tap when the bar hits the green zone</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">You have 3 lives — keep flipping!</p>
                    <button
                        onClick={startGame}
                        className="bg-brand-yellow text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-full shadow-xl hover:bg-yellow-500 transition-all active:scale-95 text-sm sm:text-base"
                    >
                        START FLIPPING
                    </button>
                </motion.div>
            )}

            {gameState === 'playing' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-md px-2"
                >
                    {/* Stats */}
                    <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6 justify-center flex-wrap">
                        <div className="bg-white px-4 sm:px-7 py-3 rounded-2xl shadow-md border border-orange-100">
                            <div className="text-xs sm:text-sm text-gray-500">Streak</div>
                            <div className="font-bold text-xl sm:text-2xl text-brand-yellow">{streak} 🔥</div>
                        </div>
                        <div className="bg-white px-4 sm:px-6 py-3 rounded-2xl shadow-md border border-red-100 flex items-center gap-2">
                            <div className="text-xs sm:text-sm text-gray-500">Lives</div>
                            <div className="font-bold text-xl sm:text-2xl text-brand-red">{lives} ❤️</div>
                        </div>
                        <div className="bg-white px-4 sm:px-6 py-3 rounded-2xl shadow-md border border-green-100 flex items-center gap-2">
                            <div className="text-xs sm:text-sm text-gray-500">Score</div>
                            <div className="font-bold text-xl sm:text-2xl text-green-600">{score}</div>
                        </div>
                        {combo > 0 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-green-100 px-4 sm:px-6 py-3 rounded-2xl shadow-md border border-green-200"
                            >
                                <div className="text-xs sm:text-sm text-green-700 font-semibold">Combo</div>
                                <div className="font-bold text-xl sm:text-2xl text-green-600">{combo}x</div>
                            </motion.div>
                        )}
                    </div>

                    {/* Timing Bar */}
                    <div className="mb-6 sm:mb-8">
                        <div className="relative h-20 sm:h-24 bg-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner border-2 sm:border-4 border-white">
                            {/* Good Zone */}
                            <div
                                className="absolute top-0 h-full bg-yellow-200"
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
                                className="absolute top-0 h-full w-1 sm:w-1.5 bg-brand-red shadow-lg"
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
                    <div className="text-center mb-6 sm:mb-8 relative h-24 sm:h-28">
                        <motion.div
                            className="text-6xl sm:text-7xl inline-block"
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
                                    animate={{ scale: 1, y: -10 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute top-0 left-1/2 -translate-x-1/2"
                                >
                                    {lastResult === 'perfect' && (
                                        <div className="text-green-500 text-3xl sm:text-4xl font-black drop-shadow-lg">
                                            ⭐ PERFECT!
                                        </div>
                                    )}
                                    {lastResult === 'good' && (
                                        <div className="text-yellow-500 text-2xl sm:text-3xl font-black drop-shadow-lg">
                                            ✓ GOOD!
                                        </div>
                                    )}
                                    {lastResult === 'miss' && (
                                        <div className="text-red-500 text-2xl sm:text-3xl font-black drop-shadow-lg">
                                            ✗ MISS!
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Flip Button */}
                    <button
                        onClick={handleFlip}
                        className="w-full bg-brand-red text-white font-bold py-4 sm:py-5 px-8 rounded-full shadow-xl hover:bg-red-600 transition-all text-lg sm:text-xl active:scale-95 touch-manipulation"
                    >
                        FLIP!
                    </button>
                </motion.div>
            )}

            {gameState === 'finished' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center px-4"
                >
                    <div className="text-5xl sm:text-6xl mb-4">
                        {streak >= 20 ? '🏆' : streak >= 10 ? '🎉' : '👍'}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-text mb-3 sm:mb-4">
                        {streak >= 20 ? 'Amazing!' : streak >= 10 ? 'Great Job!' : 'Good Try!'}
                    </h2>
                    <div className="text-lg sm:text-xl text-gray-600 mb-2 sm:mb-3">
                        Score: <span className="font-bold text-green-600">{score}</span>
                    </div>
                    <div className="text-base sm:text-lg text-gray-500 mb-4 sm:mb-6">
                        Lives used: <span className="font-semibold text-brand-red">{3 - lives}</span>
                    </div>
                    <button
                        onClick={startGame}
                        className="bg-brand-yellow text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-full shadow-xl hover:bg-yellow-500 transition-all active:scale-95 text-sm sm:text-base"
                    >
                        Play again
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default FryFlip;
