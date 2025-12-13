import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameWrapper from '../game-ui/GameWrapper';
import GameHeader from '../game-ui/GameHeader';
import GameOverlay from '../game-ui/GameOverlay';
import GameButton from '../game-ui/GameButton';
import { Trophy, HelpCircle } from 'lucide-react';

const QUESTIONS = [
    {
        id: 1,
        question: "Which sauce is known as the 'Boss'?",
        options: ["BBQ", "Tom Yum", "Happy Sauce", "Garlic Aioli"],
        correct: 2 // Index
    },
    {
        id: 2,
        question: "What is the best side for nuggets?",
        options: ["Fries", "Salad", "Soup", "Rice"],
        correct: 0
    },
    {
        id: 3,
        question: "How many nuggets are in a 'Mega Box'?",
        options: ["6", "10", "20", "50"],
        correct: 2
    },
    {
        id: 4,
        question: "Which color is the Happy Potato?",
        options: ["Red", "Blue", "Yellow", "Green"],
        correct: 2
    },
    {
        id: 5,
        question: "What year was Happy Potato founded?",
        options: ["2010", "2015", "2020", "2023"],
        correct: 1
    }
];

const TriviaBite = ({ onSpinComplete }) => {
    const [gameState, setGameState] = useState('ready');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const hasClaimedRef = useRef(false);

    const startGame = () => {
        setGameState('playing');
        setCurrentQuestion(0);
        setScore(0);
        setStreak(0);
        setSelectedOption(null);
        setIsCorrect(null);
        setShowFeedback(false);
        hasClaimedRef.current = false;
    };

    const handleOptionSelect = (index) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);

        const correct = index === QUESTIONS[currentQuestion].correct;
        setIsCorrect(correct);
        setShowFeedback(true);

        if (correct) {
            setScore(prev => prev + 10 + (streak * 5));
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }

        setTimeout(() => {
            if (currentQuestion < QUESTIONS.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setSelectedOption(null);
                setIsCorrect(null);
                setShowFeedback(false);
            } else {
                endGame();
            }
        }, 1500);
    };

    const handleComplete = () => {
        onSpinComplete({
            type: 'points',
            value: score,
            label: `${score} Points! (${streak} max streak)`
        });
    };

    const autoClaimOnce = () => {
        if (hasClaimedRef.current) return;
        hasClaimedRef.current = true;
        handleComplete();
    };

    const endGame = () => {
        autoClaimOnce();
        setGameState('finished');
    };

    return (
        <GameWrapper title="Trivia Bite">
            <GameOverlay
                isVisible={gameState === 'ready'}
                title="Trivia Bite"
                subtitle="Test your food knowledge! Correct answers build your streak."
                icon={HelpCircle}
                onPrimaryAction={startGame}
                primaryActionText="START QUIZ"
            />

            <GameOverlay
                isVisible={gameState === 'finished'}
                type="gameover"
                title="Quiz Complete!"
                subtitle={`Streak: ${streak} 🔥`}
                score={score}
                icon={Trophy}
                onPrimaryAction={startGame}
                primaryActionText="Play Again"
            />

            <GameHeader
                stats={[
                    { label: 'Score', value: score, color: 'brand-yellow' },
                    { label: 'Question', value: `${currentQuestion + 1}/${QUESTIONS.length}`, color: 'brand-red' }
                ]}
            />

            {gameState === 'playing' && (
                <div className="w-full max-w-md mx-auto px-2">
                    {/* Question Card */}
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-3xl p-6 shadow-xl mb-6 min-h-[160px] flex items-center justify-center text-center border border-gray-100"
                    >
                        <h3 className="text-xl sm:text-2xl font-bold text-brand-text">
                            {QUESTIONS[currentQuestion].question}
                        </h3>
                    </motion.div>

                    {/* Options */}
                    <div className="space-y-3">
                        {QUESTIONS[currentQuestion].options.map((option, index) => {
                            let stateStyles = "bg-white hover:bg-gray-50 text-gray-700 border-gray-200";

                            if (selectedOption !== null) {
                                if (index === QUESTIONS[currentQuestion].correct) {
                                    stateStyles = "bg-green-500 text-white border-green-600 shadow-lg scale-[1.02]";
                                } else if (index === selectedOption) {
                                    stateStyles = "bg-red-500 text-white border-red-600 opacity-80";
                                } else {
                                    stateStyles = "bg-gray-100 text-gray-400 border-gray-100 opacity-50";
                                }
                            }

                            return (
                                <motion.button
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={selectedOption !== null}
                                    className={`w-full p-4 sm:p-5 rounded-2xl font-bold text-left transition-all border-2 text-base sm:text-lg shadow-sm ${stateStyles}`}
                                    whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{option}</span>
                                        {selectedOption !== null && index === QUESTIONS[currentQuestion].correct && (
                                            <span className="bg-white/20 p-1 rounded-full">✓</span>
                                        )}
                                        {selectedOption === index && index !== QUESTIONS[currentQuestion].correct && (
                                            <span className="bg-white/20 p-1 rounded-full">✗</span>
                                        )}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            )}
        </GameWrapper>
    );
};

export default TriviaBite;
