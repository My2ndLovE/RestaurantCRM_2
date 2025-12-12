import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle2, XCircle } from 'lucide-react';

const TRIVIA_QUESTIONS = [
    {
        question: "Happy Potato's vision for 2025-2030 is to become:",
        options: [
            "Largest snacking chain in Malaysia & S.E.A",
            "Potato farm of Southeast Asia",
            "Biggest burger chain in Malaysia",
            "First potato space café"
        ],
        correct: 0
    },
    {
        question: "How many outlets are already part of the Happy Potato family?",
        options: ["25", "60", "100", "140"],
        correct: 2
    },
    {
        question: "Roughly how many fries does Happy Potato serve per year?",
        options: ["1 million", "5 million", "10 million", "25 million"],
        correct: 2
    },
    {
        question: "Which core value celebrates premium potatoes and seasonings?",
        options: ["Collective Happiness", "Affordable Bliss", "Quality Delights", "Vibrant Community Spirit"],
        correct: 2
    },
    {
        question: "Which promise keeps Happy Potato snacks priced so everyone can enjoy them?",
        options: ["Golden Guarantee", "Affordable Bliss", "Happiness Pledge", "Mega Value"],
        correct: 1
    },
    {
        question: "Shaker Fries + Chicken Pop is featured under which menu section?",
        options: ["Drinks", "Desserts", "Chicken & Specialty Fries", "Breakfast"],
        correct: 2
    },
    {
        question: "What's the biggest fry size you can order at Happy Potato?",
        options: ["Regular", "Mega", "Giga", "Ultra"],
        correct: 2
    },
    {
        question: "The brand tagline on their story page is:",
        options: [
            "Serving happiness to people, you & us – HAPPY TOGETHER",
            "Bringing the crunch to every lunch",
            "Potato joy in every toy",
            "Spuds before buds"
        ],
        correct: 0
    },
    {
        question: "Which core value focuses on sharing joy with customers, teams, and partners?",
        options: ["Quality Delights", "Collective Happiness", "Potato Pride", "Golden Spuds"],
        correct: 1
    },
    {
        question: "Happy Potato highlights which combo on the menu?",
        options: [
            "Shaker Fries + Chicken Nugget",
            "Fries + Ice Cream Cone",
            "Waffle Fries + Pancakes",
            "Curly Fries + Hotdog"
        ],
        correct: 0
    }
];

const TriviaBite = ({ onSpinComplete }) => {
    const [gameState, setGameState] = useState('ready');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const startGame = () => {
        // Pick 3 random questions
        const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 3);

        setSelectedQuestions(selected);
        setCurrentQuestionIndex(0);
        setCorrectCount(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setGameState('playing');
    };

    const handleAnswer = (answerIndex) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(answerIndex);
        const isCorrect = answerIndex === selectedQuestions[currentQuestionIndex].correct;

        if (isCorrect) {
            setCorrectCount(prev => prev + 1);
        }

        setShowResult(true);

        setTimeout(() => {
            if (currentQuestionIndex < selectedQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                endGame(isCorrect ? correctCount + 1 : correctCount);
            }
        }, 1500);
    };

    const endGame = (finalScore) => {
        setGameState('finished');

        const points = finalScore * 15;
        setTimeout(() => {
            onSpinComplete({
                type: 'points',
                value: points,
                label: `${points} Points! (${finalScore}/3 correct)`
            });
        }, 1000);
    };

    const currentQuestion = selectedQuestions[currentQuestionIndex];

    return (
        <div className="flex flex-col items-center justify-center p-3 sm:p-6 min-h-[550px]">
            {gameState === 'ready' && (
                <div className="text-center mb-8 px-4">
                    <div className="mb-4 sm:mb-6">
                        <Brain size={48} className="sm:w-16 sm:h-16 text-brand-brown mx-auto mb-3 sm:mb-4" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-brand-text mb-3 sm:mb-4">Trivia Bite — Happy Potato Edition 🥔</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">Answer 3 quick potato-powered questions.</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Learn the Happy Potato story while you play.</p>
                    <button
                        onClick={startGame}
                        className="bg-brand-brown text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-full shadow-xl hover:bg-amber-800 transition-all active:scale-95 text-sm sm:text-base"
                    >
                        START QUIZ
                    </button>
                </div>
            )}

            {gameState === 'playing' && currentQuestion && (
                <div className="w-full max-w-lg px-2 sm:px-4">
                    {/* Progress */}
                    <div className="flex gap-2 mb-6 justify-center">
                        {selectedQuestions.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 flex-1 rounded-full ${idx < currentQuestionIndex
                                    ? 'bg-green-500'
                                    : idx === currentQuestionIndex
                                        ? 'bg-brand-yellow'
                                        : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Score */}
                    <div className="text-center mb-4 sm:mb-6">
                        <div className="bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg inline-block">
                            <span className="text-xs sm:text-sm text-gray-500">Correct: </span>
                            <span className="font-bold text-lg sm:text-xl text-green-600">{correctCount}</span>
                            <span className="text-gray-400"> / {selectedQuestions.length}</span>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl mb-4 sm:mb-6">
                        <div className="text-xs sm:text-sm text-gray-500 mb-2">Question {currentQuestionIndex + 1}</div>
                        <h3 className="text-lg sm:text-xl font-bold text-brand-text mb-4 sm:mb-6">
                            {currentQuestion.question}
                        </h3>

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = selectedAnswer === idx;
                                const isCorrect = idx === currentQuestion.correct;
                                const showCorrect = showResult && isCorrect;
                                const showWrong = showResult && isSelected && !isCorrect;

                                return (
                                    <motion.button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={selectedAnswer !== null}
                                        className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl font-semibold text-left transition-all text-sm sm:text-base touch-manipulation ${showCorrect
                                            ? 'bg-green-500 text-white'
                                            : showWrong
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200 text-brand-text'
                                            }`}
                                        whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                                        whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {showCorrect && <CheckCircle2 size={24} />}
                                            {showWrong && <XCircle size={24} />}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'finished' && (
                <div className="text-center px-4">
                    <div className="mb-4 sm:mb-6 text-5xl sm:text-6xl">
                        {correctCount === 3 ? '🥔🏆' : correctCount >= 2 ? '🥔🎉' : '📚'}
                        <span className="text-6xl ml-2">
                            {correctCount === 3 ? '🥔' : correctCount >= 2 ? '🎉' : '🥔'}
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-text mb-3 sm:mb-4">
                        {correctCount === 3 ? 'Spudtacular!' : correctCount >= 2 ? 'Great Job!' : 'Keep Learning!'}
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-6">
                        You got <span className="font-bold text-green-600">{correctCount}</span> out of 3 correct!
                    </p>
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

export default TriviaBite;
