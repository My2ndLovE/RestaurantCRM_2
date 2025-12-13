import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import happyPotatoLogo from '../../assets/images/happypotato/happypotato-logo.png';
import GameWrapper from '../game-ui/GameWrapper';
import GameHeader from '../game-ui/GameHeader';
import GameOverlay from '../game-ui/GameOverlay';
import GameButton from '../game-ui/GameButton';
import { Package } from 'lucide-react';

const GOOD_ITEMS = ['🍗', '🍟', '🌭', '🍔', '🥓', '🧀'];
const BAD_ITEMS = ['🗑️', '🪣', '🧹', '☣️'];
const GAME_DURATION = 40;
const CATCH_LINE = 84;
const BASKET_WIDTH = 18;

const NuggetPopCatch = ({ onSpinComplete }) => {
    const [gameState, setGameState] = useState('ready');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [basketPosition, setBasketPosition] = useState(50);
    const [items, setItems] = useState([]);
    const [scorePopups, setScorePopups] = useState([]);
    const [bursts, setBursts] = useState([]);
    const [basketFeedback, setBasketFeedback] = useState(null);
    const [sparks, setSparks] = useState([]);
    const [flash, setFlash] = useState(null);

    const scoreRef = useRef(score);
    const gameAreaRef = useRef(null);
    const itemIdRef = useRef(0);
    const popupIdRef = useRef(0);
    const burstIdRef = useRef(0);
    const sparkGroupRef = useRef(0);
    const timerRef = useRef(null);
    const spawnRef = useRef(null);
    const loopRef = useRef(null);
    const lastFrameRef = useRef(null);
    const timeRef = useRef(GAME_DURATION);
    const basketRef = useRef(basketPosition);
    const hasClaimedRef = useRef(false);

    useEffect(() => {
        basketRef.current = basketPosition;
    }, [basketPosition]);

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    useEffect(() => {
        return () => {
            stopAll();
        };
    }, []);

    const stopAll = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnRef.current) clearInterval(spawnRef.current);
        if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };

    const handleMove = (e) => {
        if (gameState !== 'playing' || !gameAreaRef.current) return;

        const rect = gameAreaRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const x = clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setBasketPosition(Math.max(10, Math.min(90, percentage)));
    };

    const addScorePopup = (text, x, isGood) => {
        const id = popupIdRef.current++;
        setScorePopups((prev) => [...prev, { id, text, x, isGood }]);
        setTimeout(() => {
            setScorePopups((prev) => prev.filter((p) => p.id !== id));
        }, 900);
    };

    const addBurst = (x) => {
        const id = burstIdRef.current++;
        setBursts((prev) => [...prev, { id, x }]);
        setTimeout(() => {
            setBursts((prev) => prev.filter((b) => b.id !== id));
        }, 600);
    };

    const addSparks = (type, x) => {
        const group = sparkGroupRef.current++;
        const palette = type === 'good'
            ? ['#22c55e', '#a3e635', '#facc15']
            : ['#ef4444', '#fb7185', '#fca5a5'];
        const bundle = Array.from({ length: 8 }, (_, i) => ({
            id: `${group}-${i}`,
            group,
            x,
            color: palette[i % palette.length],
            dx: Math.random() * 30 - 15,
            dy: (type === 'good' ? -1 : 1) * (20 + Math.random() * 26),
        }));

        setSparks((prev) => [...prev, ...bundle]);
        setTimeout(() => {
            setSparks((prev) => prev.filter((s) => s.group !== group));
        }, 520);
    };

    const handleCatch = (item) => {
        if (item.type === 'good') {
            setScore((prev) => prev + 10);
            addScorePopup('+10', basketRef.current, true);
            addBurst(basketRef.current);
            addSparks('good', basketRef.current);
            setBasketFeedback({ type: 'good', key: Date.now() });
            setFlash({ type: 'good', key: Date.now() });
        } else {
            setScore((prev) => Math.max(0, prev - 12));
            addScorePopup('-12', basketRef.current, false);
            addSparks('bad', basketRef.current);
            setBasketFeedback({ type: 'bad', key: Date.now() });
            setFlash({ type: 'bad', key: Date.now() });
        }
        setTimeout(() => setFlash(null), 180);
    };

    const loop = useCallback(
        (now) => {
            if (!lastFrameRef.current) lastFrameRef.current = now;
            const delta = now - lastFrameRef.current;
            lastFrameRef.current = now;

            setItems((prev) => {
                const next = [];
                prev.forEach((item) => {
                    const newY = item.y + delta * item.speed;

                    // Check collision when item reaches catch line
                    if (newY >= CATCH_LINE - 2 && newY <= CATCH_LINE + 8) {
                        const basketLeft = basketRef.current - BASKET_WIDTH / 2;
                        const basketRight = basketRef.current + BASKET_WIDTH / 2;
                        const itemWidth = 4;
                        const itemLeft = item.x - itemWidth / 2;
                        const itemRight = item.x + itemWidth / 2;
                        const isInside = itemRight >= basketLeft && itemLeft <= basketRight;

                        if (isInside) {
                            handleCatch(item);
                            return;
                        }
                    }

                    if (newY >= CATCH_LINE + 10) {
                        return;
                    }

                    next.push({ ...item, y: newY });
                });
                return next;
            });

            loopRef.current = requestAnimationFrame(loop);
        },
        []
    );

    const spawnItem = useCallback((progress = 0) => {
        const isGood = Math.random() > 0.25;
        const baseSpeed = 0.055;
        const ramp = 0.08 * Math.min(1, progress);
        const jitter = Math.random() * 0.028;
        const item = {
            id: itemIdRef.current++,
            emoji: isGood
                ? GOOD_ITEMS[Math.floor(Math.random() * GOOD_ITEMS.length)]
                : BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)],
            type: isGood ? 'good' : 'bad',
            x: 10 + Math.random() * 80,
            y: -10,
            speed: baseSpeed + ramp + jitter,
        };
        setItems((prev) => [...prev, item]);
    }, []);

    const startGame = () => {
        stopAll();
        setGameState('playing');
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setItems([]);
        setScorePopups([]);
        setBursts([]);
        scoreRef.current = 0;
        setSparks([]);
        setFlash(null);
        setBasketFeedback(null);
        setBasketPosition(50);
        timeRef.current = GAME_DURATION;
        hasClaimedRef.current = false;
        itemIdRef.current = 0;
        popupIdRef.current = 0;
        burstIdRef.current = 0;
        sparkGroupRef.current = 0;
        lastFrameRef.current = null;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    timeRef.current = 0;
                    endGame();
                    return 0;
                }
                const next = prev - 1;
                timeRef.current = next;
                return next;
            });
        }, 1000);

        spawnRef.current = setInterval(() => {
            const progress = 1 - timeRef.current / GAME_DURATION;
            spawnItem(progress);
            const extraChance = 0.12 + progress * 0.4;
            if (Math.random() < extraChance) spawnItem(progress + 0.05);
        }, 950);

        loopRef.current = requestAnimationFrame(loop);
    };

    const autoClaimOnce = () => {
        if (hasClaimedRef.current) return;
        hasClaimedRef.current = true;
        handleComplete();
    };

    const endGame = () => {
        stopAll();
        autoClaimOnce();
        setGameState('finished');
    };

    const handleComplete = () => {
        onSpinComplete({
            type: 'points',
            value: scoreRef.current,
            label: `${scoreRef.current} Points!`,
        });
    }

    return (
        <GameWrapper title="Happy Potato Catch">
            <GameOverlay
                isVisible={gameState === 'ready'}
                title="Happy Potato Catch"
                subtitle="Drag the potato to catch snacks and dodge trash!"
                icon={Package}
                onPrimaryAction={startGame}
                primaryActionText="START CATCHING"
            />

            <GameOverlay
                isVisible={gameState === 'finished'}
                type="gameover"
                title="Time's Up!"
                score={score}
                icon={Package}
                onPrimaryAction={startGame}
                primaryActionText="Play Again"
            />

            <GameHeader
                stats={[
                    { label: 'Score', value: score, color: 'green' },
                    { label: 'Time', value: `${timeLeft}s`, color: timeLeft < 10 ? 'brand-red' : 'brand-yellow' },
                ]}
            />

            <div className="w-full max-w-2xl mx-auto px-2">
                <div
                    ref={gameAreaRef}
                    onMouseMove={handleMove}
                    onTouchMove={handleMove}
                    className="relative w-full h-[min(420px,52svh)] sm:h-[520px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-b from-sky-200 via-blue-100 to-purple-100"
                    style={{ touchAction: 'none' }}
                >
                    <div className="absolute inset-x-6 top-0 h-40 bg-gradient-to-b from-white/60 to-transparent blur-3xl pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_50%)]" />


                    <AnimatePresence>
                        {flash && (
                            <motion.div
                                key={flash.key}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.25 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className={`absolute inset-0 pointer-events-none ${flash.type === 'good' ? 'bg-green-200/40' : 'bg-red-200/45'}`}
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute text-4xl drop-shadow-lg pointer-events-none"
                                style={{
                                    left: `${item.x}%`,
                                    top: `${item.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {item.emoji}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <AnimatePresence>
                        {scorePopups.map((popup) => (
                            <motion.div
                                key={popup.id}
                                initial={{ y: 0, opacity: 1, scale: 0.9 }}
                                animate={{ y: -60, opacity: 0, scale: 1.2 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.7 }}
                                className={`absolute bottom-20 text-3xl font-extrabold pointer-events-none ${popup.isGood ? 'text-green-500' : 'text-red-500'}`}
                                style={{ left: `${popup.x}%`, transform: 'translateX(-50%)' }}
                            >
                                {popup.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Effect layers (bursts, sparks) */}
                    <AnimatePresence>
                        {bursts.map((burst) => (
                            <motion.div
                                key={burst.id}
                                initial={{ scale: 0, opacity: 0.7 }}
                                animate={{ scale: 1.4, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute bottom-16 w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-300/60 via-orange-200/50 to-white/40 blur-xl pointer-events-none"
                                style={{ left: `${burst.x}%`, transform: 'translateX(-50%)' }}
                            />
                        ))}
                        {sparks.map((spark) => (
                            <motion.div
                                key={spark.id}
                                initial={{ x: 0, y: 0, opacity: 1, scale: 0.8 }}
                                animate={{ x: spark.dx, y: spark.dy, opacity: 0, scale: 1.1 }}
                                exit={{ opacity: 0 }}
                                className="absolute bottom-16 w-2.5 h-2.5 rounded-full pointer-events-none"
                                style={{ left: `${spark.x}%`, backgroundColor: spark.color }}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Player/Basket */}
                    <motion.div
                        className="absolute bottom-4 flex flex-col items-center"
                        animate={{ left: `${basketPosition}%` }}
                        transition={{ type: 'tween', duration: 0.08, ease: 'linear' }}
                        style={{ transform: 'translateX(-50%)' }}
                    >
                        <motion.div
                            key={basketFeedback?.key || 'idle'}
                            animate={
                                basketFeedback?.type === 'good'
                                    ? { scale: [1, 1.15, 1], y: [0, -8, 0] }
                                    : basketFeedback?.type === 'bad'
                                        ? { rotate: [0, -6, 6, 0] }
                                        : { scale: 1 }
                            }
                            transition={{ duration: 0.35 }}
                            className="relative"
                        >
                            <div className="relative w-32">
                                <img
                                    src={happyPotatoLogo}
                                    alt="Happy Potato catcher"
                                    className="w-full h-auto drop-shadow-2xl select-none pointer-events-none"
                                    draggable={false}
                                />
                            </div>
                        </motion.div>
                        <div className="mt-1 w-28 h-2 bg-black/15 rounded-full blur-sm" />
                    </motion.div>
                </div>
            </div>
        </GameWrapper>
    );
};

export default NuggetPopCatch;
