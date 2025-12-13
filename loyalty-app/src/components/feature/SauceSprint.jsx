import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import happyPotatoChar from '../../assets/images/happypotato/happypotato-char.png';
import GameWrapper from '../game-ui/GameWrapper';
import GameHeader from '../game-ui/GameHeader';
import GameOverlay from '../game-ui/GameOverlay';
import GameButton from '../game-ui/GameButton';
import { Zap } from 'lucide-react';

const LANES = 3;
const COLLECTIBLES = ['🍟', '🍗', '🍔', '🌭', '🥓', '🧀'];
const OBSTACLES = ['🔥'];
const GAME_DURATION = 45;

const SauceSprint = ({ onSpinComplete }) => {
    const [gameState, setGameState] = useState('ready');
    const [playerLane, setPlayerLane] = useState(1);
    const [items, setItems] = useState([]);
    const [score, setScore] = useState(0);
    const [distance, setDistance] = useState(0);
    const [scorePopups, setScorePopups] = useState([]);
    const [flash, setFlash] = useState(null);

    const itemIdRef = useRef(0);
    const popupIdRef = useRef(0);
    const spawnRef = useRef(null);
    const timerRef = useRef(null);
    const loopRef = useRef(null);
    const lastFrameRef = useRef(null);
    const scoreRef = useRef(0);
    const distanceRef = useRef(0);
    const playerLaneRef = useRef(1);
    const gameAreaRef = useRef(null);
    const touchStartRef = useRef(null);
    const hasClaimedRef = useRef(false);

    useEffect(() => {
        scoreRef.current = score;
        distanceRef.current = distance;
        playerLaneRef.current = playerLane;
    }, [score, distance, playerLane]);

    useEffect(() => {
        return () => stopAll();
    }, []);

    const stopAll = () => {
        if (spawnRef.current) clearInterval(spawnRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };

    const getLaneXPosition = (lane) => {
        const laneWidth = 100 / LANES;
        return laneWidth * lane + laneWidth / 2;
    };

    const addScorePopup = (text, lane, isGood) => {
        const id = popupIdRef.current++;
        setScorePopups(prev => [...prev, { id, text, lane, isGood }]);
        setTimeout(() => {
            setScorePopups(prev => prev.filter(p => p.id !== id));
        }, 800);
    };

    const handleCollision = (item) => {
        if (item.isCollectible) {
            setScore(prev => prev + 10);
            setDistance(prev => prev + 5);
            addScorePopup('+10', item.lane, true);
            setFlash({ type: 'good', key: Date.now() });
        } else {
            setFlash({ type: 'bad', key: Date.now() });
            setTimeout(() => endGame(), 100);
        }
        setTimeout(() => setFlash(null), 150);
    };

    const loop = useCallback((now) => {
        if (!lastFrameRef.current) lastFrameRef.current = now;
        const delta = now - lastFrameRef.current;
        lastFrameRef.current = now;

        setItems(prev => {
            const next = [];
            prev.forEach(item => {
                const newY = item.y + delta * item.speed;
                // Collision detection
                if (newY >= 80 && newY <= 85 && !item.collected) {
                    if (item.lane === playerLaneRef.current) {
                        item.collected = true;
                        handleCollision(item);
                        return;
                    }
                }
                if (newY >= 105) return;
                next.push({ ...item, y: newY });
            });
            return next;
        });

        loopRef.current = requestAnimationFrame(loop);
    }, []);

    const spawnItem = useCallback((progress = 0) => {
        const isCollectible = Math.random() > 0.35;
        const lane = Math.floor(Math.random() * LANES);
        const baseSpeed = 0.035;
        const ramp = 0.025 * Math.min(1, progress);

        const item = {
            id: itemIdRef.current++,
            lane,
            emoji: isCollectible
                ? COLLECTIBLES[Math.floor(Math.random() * COLLECTIBLES.length)]
                : OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)],
            isCollectible,
            y: -5,
            speed: baseSpeed + ramp,
            collected: false
        };

        setItems(prev => [...prev, item]);
    }, []);

    const changeLane = (newLane) => {
        if (gameState !== 'playing') return;
        const nextLane = Math.min(LANES - 1, Math.max(0, newLane));
        setPlayerLane(nextLane);
    };

    const handleTouchStart = (e) => {
        if (gameState !== 'playing') return;
        const touch = e.changedTouches?.[0];
        if (!touch) return;
        touchStartRef.current = { x: touch.clientX, time: performance.now() };
    };

    const handleTouchEnd = (e) => {
        if (gameState !== 'playing') return;
        const touch = e.changedTouches?.[0];
        if (!touch || !touchStartRef.current) return;

        const { x: startX, time: startTime } = touchStartRef.current;
        const deltaX = touch.clientX - startX;
        const deltaTime = performance.now() - startTime;
        const swipeThreshold = 28;
        const timeThreshold = 500;

        if (Math.abs(deltaX) > swipeThreshold && deltaTime < timeThreshold) {
            if (deltaX > 0) changeLane(playerLaneRef.current + 1);
            else changeLane(playerLaneRef.current - 1);
        }

        touchStartRef.current = null;
    };

    const handleTouchMove = (e) => {
        if (gameState !== 'playing') return;
        // Optional: Continuous tracking logic could go here
    };

    const startGame = () => {
        stopAll();
        setGameState('playing');
        setPlayerLane(1);
        setItems([]);
        setScore(0);
        setDistance(0);
        setScorePopups([]);
        setFlash(null);
        hasClaimedRef.current = false;
        scoreRef.current = 0;
        distanceRef.current = 0;
        playerLaneRef.current = 1;
        itemIdRef.current = 0;
        popupIdRef.current = 0;
        lastFrameRef.current = null;

        let timeLeft = GAME_DURATION;
        timerRef.current = setInterval(() => {
            timeLeft--;
            setDistance(prev => prev + 8);
            if (timeLeft <= 0) endGame();
        }, 1000);

        spawnRef.current = setInterval(() => {
            const progress = 1 - timeLeft / GAME_DURATION;
            spawnItem(progress);
            if (Math.random() < 0.25 + progress * 0.25) {
                setTimeout(() => spawnItem(progress), 400);
            }
        }, 900);

        loopRef.current = requestAnimationFrame(loop);
    };

    const handleComplete = () => {
        const finalScore = scoreRef.current + Math.floor(distanceRef.current / 2);
        onSpinComplete({
            type: 'points',
            value: finalScore,
            label: `${finalScore} Points! (${distanceRef.current}m)`
        });
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

    return (
        <GameWrapper title="Sauce Sprint!">
            <GameOverlay
                isVisible={gameState === 'ready'}
                title="Sauce Sprint!"
                subtitle="Switch lanes to collect food 🍟 and avoid fire 🔥!"
                icon={Zap}
                onPrimaryAction={startGame}
                primaryActionText="START SPRINT"
            />

            <GameOverlay
                isVisible={gameState === 'finished'}
                type="gameover"
                title="Sprint Complete!"
                score={score}
                subtitle={`Distance: ${distance}m`}
                icon={Zap}
                onPrimaryAction={startGame}
                primaryActionText="Play Again"
            />

            <GameHeader
                stats={[
                    { label: 'Score', value: score, color: 'brand-red' },
                    { label: 'Distance', value: `${distance}m`, color: 'brand-yellow' },
                ]}
            />

            <div className="w-full max-w-md mx-auto px-2">
                <div
                    ref={gameAreaRef}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                    className="relative w-full h-[min(420px,52svh)] sm:h-[500px] bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 border-white"
                    style={{ touchAction: 'none' }}
                >
                    <AnimatePresence>
                        {flash && (
                            <motion.div
                                key={flash.key}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.3 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute inset-0 pointer-events-none ${flash.type === 'good' ? 'bg-green-400' : 'bg-red-500'}`}
                            />
                        )}
                    </AnimatePresence>

                    {/* Lane markers */}
                    <div className="absolute inset-0 flex">
                        {[0, 1, 2].map(lane => (
                            <div
                                key={lane}
                                className="flex-1 flex items-center justify-center border-r border-white/10 last:border-r-0"
                            >
                                <div className="text-white/5 text-6xl font-bold">{lane + 1}</div>
                            </div>
                        ))}
                    </div>

                    {/* Road animation */}
                    <div className="absolute inset-0">
                        {[0, 1, 2].map(lane => (
                            <motion.div
                                key={`road-${lane}`}
                                className="absolute w-1 bg-yellow-400/30"
                                style={{
                                    left: `${getLaneXPosition(lane)}%`,
                                    height: '100%'
                                }}
                                animate={{
                                    backgroundPosition: ['0% 0%', '0% 100%']
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'linear'
                                }}
                            />
                        ))}
                    </div>

                    {/* Items */}
                    {items.map(item => (
                        <div
                            key={item.id}
                            className="absolute text-4xl drop-shadow-lg transition-opacity duration-200"
                            style={{
                                left: `${getLaneXPosition(item.lane)}%`,
                                top: `${item.y}%`,
                                transform: 'translate(-50%, -50%)',
                                opacity: item.collected ? 0 : 1
                            }}
                        >
                            {item.emoji}
                        </div>
                    ))}

                    <AnimatePresence>
                        {scorePopups.map(popup => (
                            <motion.div
                                key={popup.id}
                                initial={{ y: 0, opacity: 1, scale: 0.8 }}
                                animate={{ y: -50, opacity: 0, scale: 1.3 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.7 }}
                                className={`absolute text-3xl font-black pointer-events-none ${popup.isGood ? 'text-green-400' : 'text-red-400'}`}
                                style={{
                                    left: `${getLaneXPosition(popup.lane)}%`,
                                    top: '80%',
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                {popup.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Player */}
                    <motion.div
                        className="absolute z-10"
                        animate={{
                            left: `${getLaneXPosition(playerLane)}%`,
                        }}
                        transition={{ type: 'tween', duration: 0.08, ease: 'linear' }}
                        style={{
                            top: '80%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <div className="w-20 drop-shadow-2xl">
                            <img
                                src={happyPotatoChar}
                                alt="Happy Potato runner"
                                className="w-full h-auto select-none pointer-events-none"
                                draggable={false}
                            />
                        </div>
                    </motion.div>
                </div>

                <div className="flex gap-4 mt-6 justify-center">
                    <GameButton
                        onClick={() => changeLane(playerLane - 1)}
                        disabled={playerLane === 0}
                        variant="neutral"
                        size="md"
                    >
                        ← LEFT
                    </GameButton>
                    <GameButton
                        onClick={() => changeLane(playerLane + 1)}
                        disabled={playerLane === LANES - 1}
                        variant="neutral"
                        size="md"
                    >
                        RIGHT →
                    </GameButton>
                </div>
            </div>
        </GameWrapper>
    );
};

export default SauceSprint;
