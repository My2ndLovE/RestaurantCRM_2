import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import GameButton from './GameButton';
import happyPotatoHappy from '../../assets/images/happypotato/happypotato-happy.png';
import happyPotatoAngry from '../../assets/images/happypotato/happypotato-angry.png';

const GameOverlay = ({
    isVisible,
    title,
    subtitle,
    score,
    highScore,
    onPrimaryAction,
    primaryActionText = "Start Game",
    onSecondaryAction,
    secondaryActionText = "Back",
    icon: Icon,
    gameoverGraphic,
    type = 'start', // 'start' | 'gameover' | 'pause'
    outcome // 'win' | 'loss' | undefined (auto-detect)
}) => {
    // Determine outcome if not explicitly provided
    const isWin = useMemo(() => {
        if (outcome) return outcome === 'win';

        const lowerTitle = title?.toLowerCase() || '';

        const lossKeywords = ['no prize', 'better luck', 'no luck', 'nothing', 'loss', 'miss'];
        if (lossKeywords.some(k => lowerTitle.includes(k))) return false;
        if (score !== undefined) return score > 0;

        const winKeywords = ['win', 'good try', 'great', 'amazing'];
        if (winKeywords.some(k => lowerTitle.includes(k))) return true;

        return true; // Default to positive
    }, [outcome, score, title]);

    // Confetti for wins (short burst)
    useEffect(() => {
        if (isVisible && type === 'gameover' && isWin) {
            const end = Date.now() + 900;
            const colors = ['#fbbf24', '#f59e0b', '#f97316'];

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 70,
                    spread: 45,
                    origin: { x: 0 },
                    colors,
                    zIndex: 200
                });
                confetti({
                    particleCount: 5,
                    angle: 110,
                    spread: 45,
                    origin: { x: 1 },
                    colors,
                    zIndex: 200
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }, [isVisible, type, isWin]);

    const rainParticles = useMemo(
        () => Array.from({ length: 20 }).map((_, idx) => ({
            id: idx,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 1 + Math.random()
        })),
        []
    );

    if (!isVisible) return null;

    const isGameOver = type === 'gameover';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-white/80 backdrop-blur-sm rounded-3xl"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className={`my-6 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-sm w-full text-center border overflow-hidden relative ${isGameOver && !isWin
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-white border-gray-100'
                        }`}
                >
                    {isGameOver && gameoverGraphic ? (
                        <div className="mb-6 sm:mb-8 relative flex justify-center items-center py-4">
                            {gameoverGraphic}
                        </div>
                    ) : isGameOver ? (
                        <div className="mb-6 sm:mb-8 relative flex justify-center items-center py-4 min-h-[160px]">
                            {isWin ? (
                                <>
                                    {/* --- WIN STATE --- */}
                                    {/* Rotating Sunburst */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30"
                                    >
                                        <div className="w-[140%] h-[140%] bg-[conic-gradient(from_0deg,transparent_0_15deg,#fbbf24_15deg_30deg,transparent_30deg_360deg)] rounded-full blur-xl" />
                                        <div className="absolute w-[140%] h-[140%] bg-[conic-gradient(from_120deg,transparent_0_15deg,#f59e0b_15deg_30deg,transparent_30deg_360deg)] rounded-full blur-xl" />
                                        <div className="absolute w-[140%] h-[140%] bg-[conic-gradient(from_240deg,transparent_0_15deg,#f97316_15deg_30deg,transparent_30deg_360deg)] rounded-full blur-xl" />
                                    </motion.div>

                                    {/* Dropping Coins */}
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        {Array.from({ length: 15 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute text-2xl"
                                                initial={{ y: -50, opacity: 0 }}
                                                animate={{ y: 350, opacity: [1, 1, 0], rotate: [0, 360] }}
                                                transition={{
                                                    duration: 1.5 + Math.random(),
                                                    delay: Math.random() * 2,
                                                    repeat: Infinity,
                                                    ease: 'linear'
                                                }}
                                                style={{ left: `${Math.random() * 100}%` }}
                                            >
                                                💰
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Character (Static) */}
                                    <div className="relative w-40 sm:w-48 z-10 drop-shadow-2xl">
                                        <img
                                            src={happyPotatoHappy}
                                            alt="Happy Potato Win"
                                            className="w-full h-auto select-none"
                                            draggable={false}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* --- LOSS STATE --- */}
                                    {/* Gloom Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />

                                    {/* Rain */}
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        {rainParticles.map((p) => (
                                            <motion.div
                                                key={p.id}
                                                className="absolute bg-blue-400/60 rounded-full"
                                                initial={{ y: -20, opacity: 0 }}
                                                animate={{ y: 250, opacity: [0, 0.8, 0] }}
                                                transition={{
                                                    duration: p.duration,
                                                    delay: p.delay,
                                                    repeat: Infinity,
                                                    ease: 'linear'
                                                }}
                                                style={{
                                                    width: '2px',
                                                    height: '24px',
                                                    left: `${p.left}%`,
                                                    top: '-24px'
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Character */}
                                    <motion.div
                                        className="relative w-36 sm:w-44 z-10 drop-shadow-lg grayscale-[0.2]"
                                        animate={{ rotate: [-2, 2, -2] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <img
                                            src={happyPotatoAngry}
                                            alt="Happy Potato Lost"
                                            className="w-full h-auto select-none"
                                            draggable={false}
                                        />
                                    </motion.div>
                                </>
                            )}
                        </div>
                    ) : Icon && (
                        <div className="mb-4 sm:mb-6 flex justify-center">
                            <div className={`p-4 rounded-full ${isWin ? 'bg-brand-bg text-brand-red' : 'bg-slate-100 text-slate-500'}`}>
                                <Icon size={48} className="sm:w-16 sm:h-16" />
                            </div>
                        </div>
                    )}

                    <h2 className={`text-2xl sm:text-3xl font-black mb-2 ${isWin ? 'text-brand-text' : 'text-slate-600'}`}>
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="text-gray-500 mb-6 text-sm sm:text-base font-medium">
                            {subtitle}
                        </p>
                    )}

                    {isGameOver && score !== undefined && (
                        <div className={`mb-8 p-4 rounded-2xl border ${isWin ? 'bg-brand-bg border-orange-100' : 'bg-slate-100 border-slate-200'
                            }`}>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Final Score</div>
                            <div className={`text-4xl font-black ${isWin ? 'text-brand-red' : 'text-slate-700'}`}>
                                {score}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <GameButton
                            onClick={onPrimaryAction}
                            fullWidth
                            size="lg"
                            variant={isWin ? 'primary' : 'neutral'}
                            className="shadow-xl"
                        >
                            {primaryActionText}
                        </GameButton>

                        {onSecondaryAction && (
                            <button
                                onClick={onSecondaryAction}
                                className="text-gray-400 font-bold text-sm hover:text-gray-600 py-2 transition-colors"
                            >
                                {secondaryActionText}
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GameOverlay;
