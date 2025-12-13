import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Timer } from 'lucide-react';
import GameWrapper from '../game-ui/GameWrapper';
import GameHeader from '../game-ui/GameHeader';
import GameOverlay from '../game-ui/GameOverlay';
import GameButton from '../game-ui/GameButton';

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
    const hasClaimedRef = useRef(false);
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
        hasClaimedRef.current = false;
        generateNewCombo();
    };

    const handleDrop = (slotIndex, item) => {
        if (gameState !== 'playing') return;

        const newSlots = [...slots];
        newSlots[slotIndex] = item;

        if (item !== currentCombo.items[slotIndex]) {
            setTimeout(() => {
                setSlots(new Array(currentCombo.items.length).fill(null));
            }, 300);
            setSlots(newSlots);
            return;
        }

        setSlots(newSlots);

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

        autoClaimOnce();
        setGameState('finished');
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleComplete = () => {
        const finalScore = scoreRef.current * 20;
        onSpinComplete({
            type: 'points',
            value: finalScore,
            label: `${finalScore} Points! (${scoreRef.current} combos)`
        });
    };

    const autoClaimOnce = () => {
        if (hasClaimedRef.current) return;
        hasClaimedRef.current = true;
        handleComplete();
    };

    return (
        <GameWrapper title="Combo Builder">
            <GameOverlay
                isVisible={gameState === 'ready'}
                title="Combo Builder"
                subtitle="Tap items to build the combo in the correct order!"
                icon={Timer}
                onPrimaryAction={startGame}
                primaryActionText="START BUILDING"
            />

            <GameOverlay
                isVisible={gameState === 'finished'}
                type="gameover"
                title="Time's Up!"
                subtitle={`Combos Built: ${score}`}
                score={score * 20}
                icon={Timer}
                onPrimaryAction={startGame}
                primaryActionText="Play Again"
            />

            <GameHeader
                stats={[
                    { label: 'Combos', value: score, color: 'brand-brown' },
                    { label: 'Time', value: `${timeLeft}s`, color: timeLeft < 10 ? 'brand-red' : 'brand-yellow' },
                ]}
            />

            {gameState === 'playing' && currentCombo && (
                <div className="w-full max-w-md mx-auto px-2">
                    <h3 className="text-xl font-bold text-center mb-4 text-brand-text">
                        {currentCombo.name}
                    </h3>

                    {/* Required Items Display */}
                    <div className="flex justify-center gap-3 mb-6">
                        {currentCombo.items.map((item, idx) => (
                            <div key={`hint-${idx}`} className="text-center">
                                <div className="text-3xl mb-1">{item}</div>
                                <div className="text-xs text-gray-400">#{idx + 1}</div>
                            </div>
                        ))}
                    </div>

                    {/* Combo Slots */}
                    <div className="flex justify-center gap-3 mb-8">
                        {currentCombo.items.map((requiredItem, idx) => (
                            <motion.div
                                key={idx}
                                className={`w-20 h-20 rounded-2xl border-4 flex items-center justify-center text-4xl bg-white touch-manipulation shadow-md ${slots[idx] === requiredItem
                                    ? 'border-green-500 bg-green-50'
                                    : slots[idx]
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-dashed border-gray-300'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                            >
                                {slots[idx] || '?'}
                            </motion.div>
                        ))}
                    </div>

                    {/* Available Items */}
                    <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                        <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 font-medium">Tap to add to next empty slot</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {availableItems.map((item, idx) => (
                                <motion.button
                                    key={idx}
                                    onClick={() => {
                                        const nextEmptySlot = slots.findIndex(s => s === null);
                                        if (nextEmptySlot !== -1) {
                                            handleDrop(nextEmptySlot, item);
                                        }
                                    }}
                                    className="w-16 h-16 bg-brand-yellow/10 border-2 border-brand-yellow/30 rounded-xl text-3xl hover:bg-brand-yellow hover:text-white transition-all shadow-sm touch-manipulation"
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
        </GameWrapper>
    );
};

export default ComboBuilder;
