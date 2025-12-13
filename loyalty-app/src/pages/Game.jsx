import React, { useState, useEffect } from 'react';
import WheelGame from '../components/feature/WheelGame';
import ScratchCard from '../components/feature/ScratchCard';
import SauceShuffle from '../components/feature/SauceShuffle';
import NuggetPopCatch from '../components/feature/NuggetPopCatch';
import ComboBuilder from '../components/feature/ComboBuilder';
import FryFlip from '../components/feature/FryFlip';
import SauceSprint from '../components/feature/SauceSprint';
import TriviaBite from '../components/feature/TriviaBite';
import SuccessAnimation from '../components/feature/SuccessAnimation';
import successData from '../assets/lottie/success.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Dices, Gift, Zap, Brain, Timer, Package, Flame, CircleDollarSign, ChevronLeft } from 'lucide-react';
import Leaderboard from '../components/feature/Leaderboard';
import CoinDropPlinko from '../components/feature/CoinDropPlinko';

const GAMES = [
    { id: 'wheel', name: 'Flavor Spin', description: 'Spin to win points & vouchers!', color: 'bg-brand-red', icon: Dices },
    { id: 'scratch', name: 'Lucky Scratch', description: 'Scratch to reveal hidden prizes.', color: 'bg-brand-yellow', icon: Gift },
    { id: 'plinko', name: 'Coin Drop Plinko', description: 'Drop coins through pegs to score.', color: 'bg-emerald-600', icon: CircleDollarSign },
    { id: 'shuffle', name: 'Sauce Shuffle', description: 'Match sauce pairs in this memory game.', color: 'bg-purple-500', icon: Brain },
    { id: 'catch', name: 'Nugget Pop Catch', description: 'Catch falling nuggets, avoid trash!', color: 'bg-green-500', icon: Package },
    { id: 'combo', name: 'Combo Builder', description: 'Build combos before time runs out!', color: 'bg-brand-brown', icon: Timer },
    { id: 'flip', name: 'Fry Flip', description: 'Perfect timing for the perfect flip!', color: 'bg-yellow-500', icon: Flame },
    { id: 'sprint', name: 'Sauce Sprint', description: 'Endless runner - dodge obstacles!', color: 'bg-red-600', icon: Zap },
    { id: 'trivia', name: 'Trivia Bite', description: 'Quick food trivia challenge!', color: 'bg-indigo-600', icon: Trophy },
];

const Game = () => {
    const [selectedGame, setSelectedGame] = useState(null);
    const [prize, setPrize] = useState(null);

    // Scroll to top when a game is selected
    useEffect(() => {
        if (selectedGame) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [selectedGame]);

    const handleBack = () => {
        setSelectedGame(null);
    };

    const handleGameComplete = (result) => {
        setTimeout(() => {
            setPrize(result);
        }, 500);
    };

    return (
        <div className={`min-h-screen bg-gray-50 ${selectedGame ? 'pb-32' : 'pb-24'}`}>
            <AnimatePresence mode="wait">
                {!selectedGame ? (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-4 sm:p-6 pt-8 sm:pt-12 max-w-4xl mx-auto"
                    >
                        <header className="mb-8">
                            <h1 className="text-3xl sm:text-4xl font-black text-brand-text mb-2">Arcade</h1>
                            <p className="text-gray-500 font-medium">Play mini-games to earn extra rewards!</p>
                        </header>

                        <div className="space-y-4 mb-12">
                            {GAMES.map((game) => (
                                <motion.div
                                    key={game.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => !game.comingSoon && setSelectedGame(game.id)}
                                    className={`relative overflow-hidden rounded-3xl p-6 shadow-lg cursor-pointer transition-all ${game.comingSoon ? 'opacity-80 grayscale' : ''} ${game.color}`}
                                >
                                    <div className="relative z-10 flex justify-between items-center text-white">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl sm:text-2xl font-black">{game.name}</h3>
                                                {game.id === 'wheel' && (
                                                    <span className="bg-white text-[10px] font-bold text-brand-text px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
                                                        Popular
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-white/90 text-sm font-medium">{game.description}</p>
                                        </div>
                                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shrink-0 ml-4">
                                            <game.icon size={28} className="text-white" />
                                        </div>
                                    </div>

                                    {/* Decorative elements */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Leaderboard Section */}
                        <Leaderboard />
                    </motion.div>
                ) : (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="h-full pt-4"
                    >
                        <div className="max-w-4xl mx-auto">
                            <div className="px-4 mb-4 flex items-center">
                                <button
                                    onClick={() => setSelectedGame(null)}
                                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-brand-text transition-colors border border-gray-100"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <span className="ml-4 font-bold text-lg text-brand-text">Back to Arcade</span>
                            </div>

                            {selectedGame === 'wheel' && <WheelGame onSpinComplete={handleGameComplete} />}
                            {selectedGame === 'scratch' && <ScratchCard onComplete={handleGameComplete} />}
                            {selectedGame === 'shuffle' && <SauceShuffle onSpinComplete={handleGameComplete} />}
                            {selectedGame === 'catch' && <NuggetPopCatch onSpinComplete={handleGameComplete} />}
                            {selectedGame === 'plinko' && <CoinDropPlinko onSpinComplete={handleGameComplete} />}
                            {selectedGame === 'combo' && <ComboBuilder onSpinComplete={handleGameComplete} />}
                            {selectedGame === 'flip' && <FryFlip onSpinComplete={handleGameComplete} />}
                            {selectedGame === 'sprint' && <SauceSprint onSpinComplete={handleGameComplete} />}
                            {selectedGame === 'trivia' && <TriviaBite onSpinComplete={handleGameComplete} />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {prize && (
                <SuccessAnimation
                    animationData={successData}
                    message={prize.type === 'loss' ? 'Oh no!' : 'You Won!'}
                    subMessage={prize.type === 'loss' ? 'Better luck next time.' : `You got ${prize.label}`}
                    onComplete={() => setPrize(null)}
                />
            )}
        </div>
    );
};

export default Game;
