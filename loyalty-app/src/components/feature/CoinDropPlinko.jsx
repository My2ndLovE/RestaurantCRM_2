import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Sparkles, CircleDollarSign } from 'lucide-react';
import happyPotatoBall from '../../assets/images/happypotato/happypotato-ball.png';
import GameWrapper from '../game-ui/GameWrapper';
import GameHeader from '../game-ui/GameHeader';
import GameOverlay from '../game-ui/GameOverlay';

const COINS_PER_RUN = 6;
const MOVE_SPEED = 60;
const BOARD_WIDTH = 100;
const BALL_SIZE = 48;

const SLOTS = [
    { id: 'm20l', label: '-20', color: 'bg-red-100', accent: '#ef4444', reward: { type: 'points', value: -20, label: '-20 Points' } },
    { id: 'p20l', label: '+20', color: 'bg-emerald-100', accent: '#10b981', reward: { type: 'points', value: 20, label: '+20 Points' } },
    { id: 'm10l', label: '-10', color: 'bg-red-100', accent: '#ef4444', reward: { type: 'points', value: -10, label: '-10 Points' } },
    { id: 'p10c', label: '+10', color: 'bg-emerald-100', accent: '#10b981', reward: { type: 'points', value: 10, label: '+10 Points' } },
    { id: 'm10r', label: '-10', color: 'bg-red-100', accent: '#ef4444', reward: { type: 'points', value: -10, label: '-10 Points' } },
    { id: 'p20r', label: '+20', color: 'bg-emerald-100', accent: '#10b981', reward: { type: 'points', value: 20, label: '+20 Points' } },
    { id: 'm20r', label: '-20', color: 'bg-red-100', accent: '#ef4444', reward: { type: 'points', value: -20, label: '-20 Points' } },
];

const FINAL_REWARDS = [
    { value: 25, label: '+25 pts', weight: 28 },
    { value: 40, label: '+40 pts', weight: 22 },
    { value: 60, label: '+60 pts', weight: 16 },
    { value: 80, label: '+80 pts', weight: 10 },
    { value: 100, label: '+100 pts', weight: 8 },
    { value: 150, label: '+150 pts', weight: 6 },
    { value: 200, label: '+200 pts', weight: 4 },
    { value: 0, label: 'No points this time', weight: 6 },
];

const CoinDropPlinko = ({ onSpinComplete }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [coinsLeft, setCoinsLeft] = useState(COINS_PER_RUN);
    const [totals, setTotals] = useState({ slotHits: 0 });
    const [status, setStatus] = useState('intro');
    const [ballPos, setBallPos] = useState({ x: 50, y: 8, rotation: 0 });
    const [activeSlot, setActiveSlot] = useState(null);
    const [currentReward, setCurrentReward] = useState(null);
    const [finalReward, setFinalReward] = useState(null);
    const [spawnKey, setSpawnKey] = useState(0);
    const hasClaimedRef = useRef(false);

    const animRef = useRef(null);
    const lastFrameRef = useRef(null);
    const physicsRef = useRef({
        x: 50,
        y: 8,
        vx: 0,
        vy: 0,
        released: false,
        landed: false,
        direction: 1,
        rotation: 0,
    });

    const findSlotIndex = (x) => {
        const spacing = BOARD_WIDTH / SLOTS.length;
        const idx = Math.floor(x / spacing);
        return Math.max(0, Math.min(SLOTS.length - 1, idx));
    };

    const rollFinalReward = () => {
        const totalWeight = FINAL_REWARDS.reduce((sum, r) => sum + r.weight, 0);
        const pick = Math.random() * totalWeight;
        let acc = 0;
        for (const r of FINAL_REWARDS) {
            acc += r.weight;
            if (pick <= acc) return r;
        }
        return FINAL_REWARDS[0];
    };

    const pegRows = useMemo(() => {
        const dots = [];
        const ROWS_Y = [20, 32, 44, 56, 68, 80];
        ROWS_Y.forEach((y, idx) => {
            const count = idx % 2 === 0 ? 8 : 7;
            const spacing = BOARD_WIDTH / (count + 1);
            for (let i = 1; i <= count; i++) {
                dots.push({ x: spacing * i, y });
            }
        });
        return dots;
    }, []);

    const finalizeRun = useCallback(() => {
        if (hasClaimedRef.current) return;
        const reward = rollFinalReward();
        setFinalReward(reward);
        hasClaimedRef.current = true;
        onSpinComplete?.({
            type: reward.value > 0 ? 'points' : 'loss',
            value: reward.value,
            label: reward.label
        });
    }, [onSpinComplete]);

    const finishDrop = (landingX) => {
        const slotIdx = findSlotIndex(landingX);
        const slot = SLOTS[slotIdx];
        setActiveSlot(slot.id);
        setCurrentReward(slot);
        setTotals((prev) => ({ ...prev, slotHits: prev.slotHits + (slot.reward.value > 0 ? 1 : 0) }));

        setCoinsLeft((prev) => {
            const next = Math.max(0, prev - 1);
            if (next === 0) {
                finalizeRun();
                setStatus('summary');
            } else {
                setStatus('ready');
                setTimeout(spawnBall, 800);
            }
            return next;
        });
    };

    const spawnBall = () => {
        physicsRef.current = {
            x: 50,
            y: 8,
            vx: 0,
            vy: 0,
            released: false,
            landed: false,
            direction: Math.random() > 0.5 ? 1 : -1,
            rotation: 0,
        };
        setBallPos({ x: 50, y: 8, rotation: 0 });
        setActiveSlot(null);
        setCurrentReward(null);
        setSpawnKey((k) => k + 1);
    };

    useEffect(() => {
        if (!hasStarted) return;
        lastFrameRef.current = null;

        const step = (now) => {
            if (!lastFrameRef.current) lastFrameRef.current = now;
            const dt = Math.min(32, now - lastFrameRef.current);
            lastFrameRef.current = now;
            const p = physicsRef.current;

            if (!p.released && !p.landed) {
                const moveAmount = (MOVE_SPEED * dt) / 1000;
                p.x += moveAmount * p.direction;

                if (p.x >= 95) {
                    p.x = 95;
                    p.direction = -1;
                } else if (p.x <= 5) {
                    p.x = 5;
                    p.direction = 1;
                }

                const spinDirection = p.direction;
                const rotationDelta = moveAmount * spinDirection * 0.35;
                p.rotation = (p.rotation + rotationDelta) % 360;

                setBallPos({ x: p.x, y: 8, rotation: p.rotation });
            } else if (p.released && !p.landed) {
                const gravity = 0.5;
                const friction = 0.98;

                p.vy += gravity * (dt / 16.67);
                p.y += p.vy * (dt / 16.67) * 0.15;
                p.x += p.vx * (dt / 16.67) * 0.15;

                p.vx *= friction;

                const ballRadius = 2.5;
                for (const peg of pegRows) {
                    const dx = p.x - peg.x;
                    const dy = p.y - peg.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < ballRadius + 1.5) {
                        const angle = Math.atan2(dy, dx);
                        const bounceForce = 2.5;

                        p.vx = Math.cos(angle) * bounceForce;
                        p.vy = Math.sin(angle) * bounceForce * 0.5;

                        const overlap = (ballRadius + 1.5) - distance;
                        p.x += Math.cos(angle) * overlap;
                        p.y += Math.sin(angle) * overlap;

                        break;
                    }
                }

                if (p.x >= 95) {
                    p.x = 95;
                    p.vx = -Math.abs(p.vx) * 0.7;
                } else if (p.x <= 5) {
                    p.x = 5;
                    p.vx = Math.abs(p.vx) * 0.7;
                }

                if (p.y >= 92) {
                    p.y = 92;
                    p.vx = 0;
                    p.vy = 0;
                    p.landed = true;
                    finishDrop(p.x);
                }

                const spinMagnitude = Math.max(0.6, Math.hypot(p.vx, p.vy));
                const spinDirection = p.vx === 0 ? p.direction : Math.sign(p.vx) || 1;
                const rotationDelta = spinMagnitude * (dt / 16.67) * 8 * spinDirection;
                p.rotation = (p.rotation + rotationDelta) % 360;

                setBallPos({ x: p.x, y: p.y, rotation: p.rotation });
            }

            physicsRef.current = p;
            animRef.current = requestAnimationFrame(step);
        };

        animRef.current = requestAnimationFrame(step);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [hasStarted, pegRows]);

    const handleDrop = () => {
        if (!hasStarted || status !== 'ready' || coinsLeft <= 0 || physicsRef.current.released) return;

        const p = physicsRef.current;
        p.released = true;
        p.vx = p.direction * 2;
        p.vy = 0;
        setStatus('dropping');
    };

    const startGame = () => {
        setHasStarted(true);
        setCoinsLeft(COINS_PER_RUN);
        setTotals({ slotHits: 0 });
        setStatus('ready');
        setActiveSlot(null);
        setCurrentReward(null);
        setFinalReward(null);
        hasClaimedRef.current = false;
        spawnBall();
    };

    const resetGame = () => {
        setCoinsLeft(COINS_PER_RUN);
        setTotals({ slotHits: 0 });
        setStatus('ready');
        setActiveSlot(null);
        setCurrentReward(null);
        setFinalReward(null);
        hasClaimedRef.current = false;
        spawnBall();
    };

    return (
        <GameWrapper title="Coin Drop Plinko">
            <GameOverlay
                isVisible={!hasStarted}
                title="Coin Drop Plinko"
                subtitle="Tap to release each coin and rack up points."
                icon={Coins}
                onPrimaryAction={startGame}
                primaryActionText="START DROP"
            />

            {/* Summary Overlay */}
            <GameOverlay
                isVisible={status === 'summary'}
                type="gameover"
                title="All coins dropped!"
                subtitle={`Wins: ${totals.slotHits}`}
                score={finalReward ? finalReward.value : 0}
                icon={CircleDollarSign}
                onPrimaryAction={resetGame}
                primaryActionText="Play Again"
            />

            <GameHeader
                stats={[
                    { label: 'Coins', value: `${coinsLeft}/${COINS_PER_RUN}`, color: 'brand-yellow' }
                ]}
            />

            <div className="flex flex-col gap-4 items-center px-2 pb-8">
                {/* Game Board */}
                <div className="relative w-full max-w-md h-[min(340px,45svh)] sm:h-[420px] bg-gradient-to-b from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl border-4 border-white overflow-hidden shadow-2xl mb-3">
                    {/* Pegs */}
                    {pegRows.map((peg, idx) => (
                        <div
                            key={idx}
                            className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white border-2 border-purple-200 shadow-md"
                            style={{ left: `${peg.x}%`, top: `${peg.y}%`, transform: 'translate(-50%, -50%)' }}
                        />
                    ))}

                    {/* Ball */}
                    <motion.div
                        key={spawnKey}
                        className="absolute z-10"
                        style={{
                            left: `${ballPos.x}%`,
                            top: `${ballPos.y}%`,
                            transform: `translate(-50%, -50%) rotate(${ballPos.rotation}deg)`,
                            width: `${BALL_SIZE}px`,
                            height: `${BALL_SIZE}px`,
                        }}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="relative w-full h-full drop-shadow-xl">
                            <img
                                src={happyPotatoBall}
                                alt="Happy Potato ball"
                                className="w-full h-full object-contain select-none"
                                draggable={false}
                            />
                            <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_10px_18px_rgba(0,0,0,0.18)]" />
                        </div>
                    </motion.div>

                    {/* Slots */}
                    <div className="absolute bottom-0 left-0 right-0 px-1.5 sm:px-2 pb-1.5 sm:pb-2 grid grid-cols-7 gap-1">
                        {SLOTS.map((slot) => (
                            <div key={slot.id} className="flex flex-col items-center gap-0.5 sm:gap-1">
                                <motion.div
                                    animate={activeSlot === slot.id ? { scale: 1.05, y: -3 } : { scale: 1, y: 0 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                                    className={`w-full rounded-lg sm:rounded-xl border text-center text-[10px] sm:text-xs py-1.5 sm:py-2.5 font-bold ${slot.color} ${activeSlot === slot.id ? 'border-black/20 shadow-lg' : 'border-slate-200 shadow-sm'}`}
                                >
                                    {slot.label}
                                </motion.div>
                                <div className="h-0.5 sm:h-1 w-full rounded-full" style={{ background: activeSlot === slot.id ? slot.accent : 'rgba(148,163,184,0.3)' }} />
                            </div>
                        ))}
                    </div>

                    {/* Tap area */}
                    {status !== 'summary' && (
                        <div
                            className="absolute inset-x-2 top-4 bottom-24 sm:bottom-28 rounded-2xl cursor-pointer"
                            onClick={handleDrop}
                            role="button"
                            aria-label="Release"
                        >
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-red text-white text-[10px] sm:text-xs font-semibold shadow-md opacity-90">
                                    {status === 'dropping' ? 'Dropping…' : 'Tap to release'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Current Reward */}
                <AnimatePresence>
                    {currentReward && status !== 'summary' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-white border border-emerald-100 shadow-md rounded-2xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3"
                        >
                            <div className="bg-emerald-100 text-emerald-700 p-1.5 sm:p-2 rounded-full">
                                <Sparkles size={14} className="sm:w-4 sm:h-4" />
                            </div>
                            <div className="text-sm sm:text-base font-black text-brand-text">{currentReward.reward.label}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </GameWrapper>
    );
};

export default CoinDropPlinko;
