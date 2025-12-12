import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SAUCES = [
    { id: 'cheese', emoji: '🧀', name: 'Cheese' },
    { id: 'sour', emoji: '🥛', name: 'Sour Cream' },
    { id: 'tomyum', emoji: '🌶️', name: 'Tom Yum' },
    { id: 'bbq', emoji: '🍖', name: 'BBQ' },
    { id: 'ranch', emoji: '🥗', name: 'Ranch' },
    { id: 'chili', emoji: '🔥', name: 'Chili' },
    { id: 'garlic', emoji: '🧄', name: 'Garlic Aioli' },
    { id: 'teriyaki', emoji: '🍢', name: 'Teriyaki' },
];

const SauceShuffle = ({ onSpinComplete }) => {
    const [gameState, setGameState] = useState('ready');
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const movesRef = useRef(0);
    const pairCount = 8;

    useEffect(() => {
        movesRef.current = moves;
    }, [moves]);

    const startGame = () => {
        const selectedSauces = SAUCES.slice(0, pairCount);
        const pairs = [...selectedSauces, ...selectedSauces];
        const shuffled = pairs
            .map((sauce, index) => ({ ...sauce, uniqueId: `${sauce.id}-${index}` }))
            .sort(() => Math.random() - 0.5);

        setCards(shuffled);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        movesRef.current = 0;
        setStartTime(Date.now());
        setGameState('playing');
    };

    const handleCardClick = (index) => {
        if (gameState !== 'playing') return;
        if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
            return;
        }

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1);
            const [first, second] = newFlipped;

            if (cards[first].id === cards[second].id) {
                const newMatched = [...matched, first, second];
                setMatched(newMatched);
                setFlipped([]);

                if (newMatched.length === cards.length) {
                    setTimeout(() => completeGame(), 500);
                }
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    const completeGame = () => {
        setGameState('finished');
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        const finalMoves = movesRef.current;

        const basePoints = pairCount * 10;
        const timeBonus = Math.max(0, 60 - timeTaken);
        const moveBonus = Math.max(0, (pairCount * 2 - finalMoves) * 5);
        const totalScore = basePoints + timeBonus + moveBonus;

        setTimeout(() => {
            onSpinComplete({
                type: 'points',
                value: totalScore,
                label: `${totalScore} Points! (${finalMoves} moves, ${timeTaken}s)`
            });
        }, 500);
    };

    const isFlipped = (index) => flipped.includes(index) || matched.includes(index);
    const isMatched = (index) => matched.includes(index);

    return (
        <div className="flex flex-col items-center justify-center p-3 sm:p-6 min-h-[500px]">
            {gameState === 'ready' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center px-4"
                >
                    <h2 className="text-xl sm:text-2xl font-bold text-brand-text mb-3 sm:mb-4">Sauce Shuffle!</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">Match pairs of sauce emojis on a 4x4 grid.</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Fewer moves = higher score!</p>
                    <button
                        onClick={startGame}
                        className="bg-purple-500 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-full shadow-xl hover:bg-purple-600 transition-all active:scale-95 text-sm sm:text-base"
                    >
                        START GAME
                    </button>
                </motion.div>
            )}

            {gameState === 'playing' && cards.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-md px-2"
                >
                    {/* Stats */}
                    <div className="flex gap-2 sm:gap-4 justify-center mb-4 sm:mb-6">
                        <div className="bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-md">
                            <span className="text-xs sm:text-sm text-gray-500">Moves: </span>
                            <span className="font-bold text-lg sm:text-xl text-brand-red">{moves}</span>
                        </div>
                        <div className="bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-md">
                            <span className="text-xs sm:text-sm text-gray-500">Pairs: </span>
                            <span className="font-bold text-lg sm:text-xl text-brand-yellow">{matched.length / 2}</span>
                            <span className="text-gray-400">/{pairCount}</span>
                        </div>
                    </div>

                    {/* Card Grid */}
                    <div
                        className="grid gap-3 sm:gap-4 mb-4 sm:mb-6 mx-auto"
                        style={{
                            gridTemplateColumns: `repeat(4, 1fr)`,
                            maxWidth: '520px'
                        }}
                    >
                        {cards.map((card, index) => (
                            <motion.button
                                key={card.uniqueId}
                                onClick={() => handleCardClick(index)}
                                disabled={isFlipped(index)}
                                className="relative aspect-square rounded-lg sm:rounded-xl shadow-lg overflow-hidden disabled:cursor-default touch-manipulation"
                                whileHover={!isFlipped(index) ? { scale: 1.05 } : {}}
                                whileTap={!isFlipped(index) ? { scale: 0.95 } : {}}
                            >
                                <AnimatePresence mode="wait">
                                    {isFlipped(index) ? (
                                        <motion.div
                                            key="front"
                                            initial={{ rotateY: 90 }}
                                            animate={{ rotateY: 0 }}
                                            exit={{ rotateY: 90 }}
                                            transition={{ duration: 0.2 }}
                                            className={`absolute inset-0 flex items-center justify-center text-3xl sm:text-5xl ${isMatched(index) ? 'bg-green-500' : 'bg-yellow-400'
                                                }`}
                                        >
                                            {card.emoji}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="back"
                                            initial={{ rotateY: 90 }}
                                            animate={{ rotateY: 0 }}
                                            exit={{ rotateY: 90 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute inset-0 bg-red-500 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold"
                                        >
                                            ?
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        ))}
                    </div>

                    {/* Reset Button */}
                    <div className="text-center">
                        <button
                            onClick={startGame}
                            className="bg-gray-600 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:bg-gray-700 transition-all text-sm sm:text-base"
                        >
                            Reset Game
                        </button>
                    </div>
                </motion.div>
            )}

            {gameState === 'finished' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center px-4"
                >
                    <div className="text-5xl sm:text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-text mb-3 sm:mb-4">Perfect Match!</h2>
                    <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-6">
                        Completed in <span className="font-bold text-purple-600">{moves}</span> moves!
                    </p>
                    <button
                        onClick={startGame}
                        className="bg-purple-500 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-full shadow-xl hover:bg-purple-600 transition-all active:scale-95 text-sm sm:text-base"
                    >
                        Play again
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default SauceShuffle;
