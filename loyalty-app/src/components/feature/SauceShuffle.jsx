import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameWrapper from '../game-ui/GameWrapper';
import GameHeader from '../game-ui/GameHeader';
import GameOverlay from '../game-ui/GameOverlay';
import GameButton from '../game-ui/GameButton';
import { Brain } from 'lucide-react';

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
    const hasClaimedRef = useRef(false);
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
        hasClaimedRef.current = false;
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

    const handleComplete = () => {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        const finalMoves = movesRef.current;
        const basePoints = pairCount * 10;
        const timeBonus = Math.max(0, 60 - timeTaken);
        const moveBonus = Math.max(0, (pairCount * 2 - finalMoves) * 5);
        const totalScore = basePoints + timeBonus + moveBonus;
        onSpinComplete({
            type: 'points',
            value: totalScore,
            label: `${totalScore} Points! (${finalMoves} moves)`
        });
    };

    const autoClaimOnce = () => {
        if (hasClaimedRef.current) return;
        hasClaimedRef.current = true;
        handleComplete();
    };

    const completeGame = () => {
        autoClaimOnce();
        setGameState('finished');
    };

    const isFlipped = (index) => flipped.includes(index) || matched.includes(index);
    const isMatched = (index) => matched.includes(index);

    return (
        <GameWrapper title="Sauce Shuffle">
            <GameOverlay
                isVisible={gameState === 'ready'}
                title="Sauce Shuffle"
                subtitle="Match pairs of sauce emojis! Fewer moves = higher score."
                icon={Brain}
                onPrimaryAction={startGame}
                primaryActionText="START SHUFFLE"
            />

            <GameOverlay
                isVisible={gameState === 'finished'}
                type="gameover"
                title="Perfect Match!"
                subtitle={`Moves: ${moves}`}
                icon={Brain}
                onPrimaryAction={startGame}
                primaryActionText="Play Again"
            />

            <GameHeader
                stats={[
                    { label: 'Moves', value: moves, color: 'brand-red' },
                    { label: 'Pairs', value: `${matched.length / 2}/${pairCount}`, color: 'brand-yellow' },
                ]}
            />

            {gameState === 'playing' && cards.length > 0 && (
                <div className="w-full max-w-md mx-auto px-2">
                    <div
                        className="grid gap-3 sm:gap-4 mb-6 mx-auto"
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
                                className="relative aspect-square rounded-xl shadow-lg cursor-pointer overflow-hidden disabled:cursor-default touch-manipulation transform transition-transform active:scale-95"
                                whileHover={!isFlipped(index) ? { scale: 1.05 } : {}}
                            >
                                <AnimatePresence mode="wait">
                                    {isFlipped(index) ? (
                                        <motion.div
                                            key="front"
                                            initial={{ rotateY: 90 }}
                                            animate={{ rotateY: 0 }}
                                            exit={{ rotateY: 90 }}
                                            transition={{ duration: 0.2 }}
                                            className={`absolute inset-0 flex items-center justify-center text-3xl sm:text-5xl border-2 ${isMatched(index)
                                                ? 'bg-green-100 border-green-300'
                                                : 'bg-white border-brand-yellow'
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
                                            className="absolute inset-0 bg-brand-red flex items-center justify-center border-2 border-red-400"
                                        >
                                            <div className="text-white text-2xl font-bold opacity-50">?</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        ))}
                    </div>

                    <div className="text-center">
                        <GameButton
                            onClick={startGame}
                            variant="neutral"
                            size="sm"
                        >
                            Reset Game
                        </GameButton>
                    </div>
                </div>
            )}
        </GameWrapper>
    );
};

export default SauceShuffle;
