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
import { motion } from 'framer-motion';
import { ChevronLeft, Trophy, Dices, Gift, Zap, Brain, Timer, Package, Flame, CircleDollarSign } from 'lucide-react';
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

    const handleGameComplete = (result) => {
        setTimeout(() => {
            setPrize(result);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-brand-bg pb-24">
            {!selectedGame ? (
                <div className="p-6 pt-12">
                    <h1 className="text-3xl font-bold text-brand-text mb-2">Arcade</h1>
                    <p className="text-gray-500 mb-8">Play games to earn extra rewards!</p>

                    <div className="space-y-4 mb-8">
                        {GAMES.map((game) => (
                            <motion.div
                                key={game.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => !game.comingSoon && setSelectedGame(game.id)}
                                className={`relative overflow-hidden rounded-2xl p-6 shadow-lg cursor-pointer ${game.comingSoon ? 'opacity-80 grayscale' : ''} ${game.color}`}
                            >
                                <div className="relative z-10 flex justify-between items-center text-white">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">{game.name}</h3>
                                        <p className="text-white/80 text-sm">{game.description}</p>
                                    </div>
                                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                                        <game.icon size={32} />
                                    </div>
                                </div>
                                {game.comingSoon && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                        <span className="bg-white text-black font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">Coming Soon</span>
                                    </div>
                                )}
                                {/* Decorative circles */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Leaderboard Section */}
                    <Leaderboard />
                </div>
            ) : (
                <div className="h-full">
                    <div className="p-4 flex items-center">
                        <button
                            onClick={() => setSelectedGame(null)}
                            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                        >
                            <ChevronLeft size={24} className="text-brand-text" />
                        </button>
                        <span className="ml-4 font-bold text-lg text-brand-text">Back to Arcade</span>
                    </div>

                    {selectedGame === 'wheel' && (
                        <div className="p-4 text-center">
                            <div className="bg-white rounded-3xl p-4 shadow-sm mb-6 inline-block px-6">
                                <span className="text-sm text-gray-400 uppercase font-bold tracking-wider">Your Tokens</span>
                                <div className="text-2xl font-bold text-brand-red">3 Available</div>
                            </div>
                            <WheelGame onSpinComplete={handleGameComplete} />
                        </div>
                    )}

                    {selectedGame === 'scratch' && (
                        <div className="p-4 text-center flex flex-col items-center">
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl font-bold text-brand-text">Lucky Scratch</h2>
                                <p className="text-gray-500">Scratch the card to reveal your prize!</p>
                            </div>
                            <ScratchCard onComplete={handleGameComplete} />
                        </div>
                    )}

                    {selectedGame === 'shuffle' && (
                        <div className="p-4">
                            <SauceShuffle onSpinComplete={handleGameComplete} />
                        </div>
                    )}

                    {selectedGame === 'catch' && (
                        <div className="p-4">
                            <NuggetPopCatch onSpinComplete={handleGameComplete} />
                        </div>
                    )}

                    {selectedGame === 'plinko' && (
                        <div className="p-4">
                            <CoinDropPlinko onSpinComplete={handleGameComplete} />
                        </div>
                    )}

                    {selectedGame === 'combo' && (
                        <div className="p-4">
                            <ComboBuilder onSpinComplete={handleGameComplete} />
                        </div>
                    )}

                    {selectedGame === 'flip' && (
                        <div className="p-4">
                            <FryFlip onSpinComplete={handleGameComplete} />
                        </div>
                    )}

                    {selectedGame === 'sprint' && (
                        <div className="p-4">
                            <SauceSprint onSpinComplete={handleGameComplete} />
                        </div>
                    )}

                    {selectedGame === 'trivia' && (
                        <div className="p-4">
                            <TriviaBite onSpinComplete={handleGameComplete} />
                        </div>
                    )}
                </div>
            )}

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
