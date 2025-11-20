import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

const ScratchCard = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [scratchPercentage, setScratchPercentage] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Fill with scratchable layer
        ctx.fillStyle = '#C0C0C0'; // Silver color
        ctx.fillRect(0, 0, width, height);

        // Add "Scratch Me" text
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Scratch Here!', width / 2, height / 2);
    }, []);

    const handleScratch = (e) => {
        if (isRevealed) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Calculate scratched percentage
        if (Math.random() > 0.8) { // Optimization: don't check every frame
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparentPixels = 0;
            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] < 128) transparentPixels++;
            }
            const percentage = (transparentPixels / (pixels.length / 4)) * 100;
            setScratchPercentage(percentage);

            if (percentage > 50) {
                setIsRevealed(true);
                onComplete({ type: 'win', label: '50 Bonus Points', points: 50 });
            }
        }
    };

    return (
        <div className="relative w-64 h-64 mx-auto rounded-xl overflow-hidden shadow-lg bg-white">
            {/* Hidden Prize Layer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-yellow/20 p-4 text-center">
                <div className="bg-brand-yellow p-4 rounded-full mb-2 animate-bounce">
                    <Gift size={40} className="text-brand-text" />
                </div>
                <h3 className="font-bold text-xl text-brand-text">You Won!</h3>
                <p className="font-bold text-brand-red text-2xl">+50 Points</p>
            </div>

            {/* Scratchable Canvas Layer */}
            <motion.canvas
                ref={canvasRef}
                width={256}
                height={256}
                className={`absolute inset-0 cursor-pointer touch-none transition-opacity duration-700 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onMouseMove={handleScratch}
                onTouchMove={handleScratch}
            />
        </div>
    );
};

export default ScratchCard;
