import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

const COMBOS = [
    { id: 1, name: 'Classic Combo', items: ['🍟', '🍗', '🥤'] },
    { id: 2, name: 'Spicy Combo', items: ['🍟', '🌶️', '🥤'] },
    { id: 3, name: 'Mega Combo', items: ['🍟', '🍗', '🍔', '🥤'] },
    { id: 4, name: 'Kids Combo', items: ['🍟', '🍗'] },
];

const ALL_ITEMS = ['🍟', '🍗', '🍔', '🌶️', '🥤', '🌭'];

const ComboBuilder = ({ onSpinComplete }) => {
    const [gameState, setGameState] = useState('ready');
    const [currentCombo, setCurrentCombo] = useState(null);
    const [slots, setSlots] = useState([]);
    const [availableItems, setAvailableItems] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(40);
    const [round, setRound] = useState(1);
    const timerRef = useRef(null);
    const scoreRef = useRef(0);
    const gameStateRef = useRef('ready');

    useEffect(() => {
        scoreRef.current = score;
        gameStateRef.current = gameState;
    }, [score, gameState]);

    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [gameState]);

    const generateNewCombo = () => {
        const combo = COMBOS[Math.floor(Math.random() * COMBOS.length)];
        setCurrentCombo(combo);
        setSlots(new Array(combo.items.length).fill(null));

        // Mix correct items with distractors
        const distractors = ALL_ITEMS.filter(item => !combo.items.includes(item));
        const shuffled = [...combo.items, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5);
        setAvailableItems(shuffled);
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        scoreRef.current = 0;
        setTimeLeft(40);
        setRound(1);
        generateNewCombo();
    };

    const handleDrop = (slotIndex, item) => {
        if (gameState !== 'playing') return;

        const newSlots = [...slots];
        newSlots[slotIndex] = item;

        // Check if the item is correct for this position
        if (item !== currentCombo.items[slotIndex]) {
            // Wrong item - reset all slots
            setTimeout(() => {
                setSlots(new Array(currentCombo.items.length).fill(null));
            }, 300);
            setSlots(newSlots); // Show the wrong item briefly
            return;
        }

        setSlots(newSlots);

        // Check if combo is complete and all correct
        if (newSlots.every((slot, idx) => slot === currentCombo.items[idx])) {
            setScore(prev => prev + 1);
            setRound(prev => prev + 1);

            setTimeout(() => {
                if (gameStateRef.current === 'playing') {
                    generateNewCombo();
                }
            }, 500);
        }
    };

    const endGame = () => {
        if (gameStateRef.current === 'finished') return;

        setGameState('finished');
        if (timerRef.current) clearInterval(timerRef.current);

        const finalScore = scoreRef.current * 20;
        setTimeout(() => {
            onSpinComplete({
                type: 'points',
                value: finalScore,
                label: `${finalScore} Points! (${scoreRef.current} combos)`
            });
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center p-3 sm:p-6 min-h-[550px]">
            {gameState === 'ready' && (
                <div className="text-center mb-8 px-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-brand-text mb-3 sm:mb-4">Combo Builder!</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">Tap items to build the correct combo</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Match the order exactly!</p>
                    <button
                        onClick={startGame}
                        className="bg-brand-brown text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-full shadow-xl hover:bg-amber-800 transition-all active:scale-95 text-sm sm:text-base"
                    >
                        START BUILDING
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <>
                    <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg">
                            <span className="text-xs sm:text-sm text-gray-500">Combos: </span>
                            <span className="font-bold text-lg sm:text-xl text-brand-brown">{score}</span>
                        </div>
                        <div className="bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex items-center gap-2">
                            <Clock size={16} className="sm:w-5 sm:h-5 text-brand-red" />
                            <span className="font-bold text-lg sm:text-xl text-brand-red">{timeLeft}s</span>
                        </div>
                    </div>

                    {currentCombo && (
                        <div className="w-full max-w-md mb-6 sm:mb-8 px-2">
                            <h3 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3 text-brand-text">
                                {currentCombo.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 text-center mb-4">Build this combo in order:</p>

                            {/* Required Items Display */}
                            <div className="flex justify-center gap-2 sm:gap-3 mb-3">
                                {currentCombo.items.map((item, idx) => (
                                    <div key={`hint-${idx}`} className="text-center">
                                        <div className="text-2xl sm:text-3xl mb-1">{item}</div>
                                        <div className="text-xs text-gray-400">#{idx + 1}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Combo Slots */}
                            <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                                {currentCombo.items.map((requiredItem, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-4 flex items-center justify-center text-3xl sm:text-4xl touch-manipulation ${slots[idx] === requiredItem
                                            ? 'border-green-500 bg-green-50'
                                            : slots[idx]
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-dashed border-gray-300 bg-white'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {slots[idx] || '?'}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Available Items */}
                            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg">
                                <p className="text-xs sm:text-sm text-gray-500 text-center mb-2 sm:mb-3">Tap to add to next empty slot</p>
                                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                    {availableItems.map((item, idx) => (
                                        <motion.button
                                            key={idx}
                                            onClick={() => {
                                                const nextEmptySlot = slots.findIndex(s => s === null);
                                                if (nextEmptySlot !== -1) {
                                                    handleDrop(nextEmptySlot, item);
                                                }
                                            }}
                                            className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-yellow rounded-lg sm:rounded-xl text-2xl sm:text-3xl hover:bg-yellow-400 transition-all shadow-md touch-manipulation"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {item}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {gameState === 'finished' && (
                <div className="text-center px-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-text mb-3 sm:mb-4">Time's Up!</h2>
                    <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-6">Combos Built: <span className="font-bold text-brand-brown">{score}</span></p>
                    <button
                        onClick={startGame}
                        className="bg-brand-brown text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-full shadow-xl hover:bg-amber-800 transition-all active:scale-95 text-sm sm:text-base"
                    >
                        Play again
                    </button>
                </div>
            )}
        </div>
    );
};

export default ComboBuilder;
