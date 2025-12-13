import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import GameWrapper from '../game-ui/GameWrapper';
import GameHeader from '../game-ui/GameHeader';
import GameOverlay from '../game-ui/GameOverlay';
import GameButton from '../game-ui/GameButton';
import happyPotatoAngry from '../../assets/images/happypotato/happypotato-angry.png';

const PRIZES = [
    { type: 'points', value: 100, label: '+100 Points!' },
    { type: 'points', value: 50, label: '+50 Points!' },
    { type: 'points', value: 25, label: '+25 Points!' },
    { type: 'loss', value: 0, label: 'No prize this time.' },
];

const ScratchCard = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [gameState, setGameState] = useState('ready');
    const [prize, setPrize] = useState(PRIZES[1]);
    const hasClaimedRef = useRef(false);

    // Setup canvas
    useEffect(() => {
        if (gameState !== 'playing') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Reset any previous scratch state
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, width, height);

        // Fill with silver scratchable layer
        ctx.fillStyle = '#cbd5e1'; // slate-300
        ctx.fillRect(0, 0, width, height);

        // Pattern
        ctx.fillStyle = '#94a3b8'; // slate-400
        for (let i = 0; i < width; i += 20) {
            for (let j = 0; j < height; j += 20) {
                if ((i + j) % 40 === 0) ctx.fillRect(i, j, 10, 10);
            }
        }

        // Text
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SCRATCH ME!', width / 2, height / 2);
    }, [gameState]);

    const handleScratch = (e) => {
        if (gameState !== 'playing' || isRevealed) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const getPos = (evt) => {
            if (evt.touches) {
                return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
            }
            return { x: evt.clientX, y: evt.clientY };
        };

        const pos = getPos(e);
        const x = pos.x - rect.left;
        const y = pos.y - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();

        // Check progress occasionally
        if (Math.random() > 0.85) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparentPixels = 0;
            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] < 128) transparentPixels++;
            }
            const percentage = (transparentPixels / (pixels.length / 4)) * 100;

            if (percentage > 45) {
                setIsRevealed(true);
                autoClaimOnce();
                setTimeout(() => setGameState('finished'), 800);
            }
        }
    };

    const startGame = () => {
        setGameState('playing');
        setIsRevealed(false);
        setPrize(PRIZES[Math.floor(Math.random() * PRIZES.length)]);
        hasClaimedRef.current = false;
    };

    const handleClaim = () => {
        onComplete({
            type: prize.type,
            value: prize.value,
            label: prize.label
        });
    };

    const autoClaimOnce = () => {
        if (hasClaimedRef.current) return;
        hasClaimedRef.current = true;
        handleClaim();
    };

    return (
        <GameWrapper title="Lucky Scratch">
            <GameOverlay
                isVisible={gameState === 'ready'}
                title="Lucky Scratch"
                subtitle="Scratch the card to reveal your hidden prize!"
                icon={Gift}
                onPrimaryAction={startGame}
                primaryActionText="START SCRATCHING"
            />

            <GameOverlay
                isVisible={gameState === 'finished'}
                type="gameover"
                title={prize.type === 'loss' ? 'No Luck!' : 'You Won!'}
                subtitle={prize.label}
                score={prize.type === 'points' ? prize.value : undefined}
                icon={Gift}
                onPrimaryAction={startGame}
                primaryActionText="Play Again"
            />

            <GameHeader stats={[]} />

            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                    {/* Prize Layer (Underneath) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-yellow/10 p-6 text-center animate-pulse">
                        {prize.type === 'loss' ? (
                            <>
                                <div className="w-28 mb-4 drop-shadow-xl">
                                    <img
                                        src={happyPotatoAngry}
                                        alt="No prize"
                                        className="w-full h-auto select-none"
                                        draggable={false}
                                    />
                                </div>
                                <h3 className="font-black text-2xl text-brand-text mb-2">No Prize</h3>
                                <div className="font-bold text-gray-500 text-sm mt-1">Try again!</div>
                            </>
                        ) : (
                            <>
                                <div className="bg-brand-yellow p-6 rounded-full mb-4 shadow-lg">
                                    <Gift size={48} className="text-white" />
                                </div>
                                <h3 className="font-black text-2xl text-brand-text mb-2">WINNER!</h3>
                                <div className="font-black text-brand-red text-4xl drop-shadow-sm">+{prize.value}</div>
                                <div className="font-bold text-gray-400 text-sm mt-1">POINTS</div>
                            </>
                        )}
                    </div>

                    {/* Canvas Layer (Top) */}
                    <motion.canvas
                        ref={canvasRef}
                        width={288} // 72 * 4
                        height={288}
                        className={`absolute inset-0 cursor-pointer touch-none transition-opacity ${isRevealed ? 'opacity-0 pointer-events-none duration-150' : 'opacity-100 duration-0'}`}
                        onMouseMove={handleScratch}
                        onTouchMove={handleScratch}
                    />
                </div>
            </div>
        </GameWrapper>
    );
};

export default ScratchCard;
