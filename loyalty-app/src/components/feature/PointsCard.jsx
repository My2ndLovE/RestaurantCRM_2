import React, { useState } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import TierStatus from './TierStatus';
import { AnimatePresence, motion } from 'framer-motion';

const PointsCard = ({ points, nextReward }) => {
    const [showTier, setShowTier] = useState(false);
    const progress = Math.min((points / nextReward) * 100, 100);

    return (
        <>
            <motion.div
                onClick={() => setShowTier(true)}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-br from-brand-yellow to-orange-400 rounded-2xl p-6 text-brand-text shadow-lg relative overflow-hidden cursor-pointer border-2 border-white/20"
            >
                {/* Decorative Circles */}
                <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 w-24 h-24 bg-white/30 rounded-full blur-xl"
                />
                <motion.div
                    animate={{ y: [0, 15, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 w-32 h-32 bg-brand-red/10 rounded-full blur-2xl"
                />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-brand-text/80 text-sm font-medium uppercase tracking-wider">Total Points</span>
                        <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg">
                            <Star size={16} className="text-brand-text fill-brand-text" />
                        </div>
                    </div>

                    <div className="text-5xl font-bold mb-6 tracking-tight">
                        {points.toLocaleString()}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-brand-text/90">
                            <span>{points} / {nextReward} to next reward</span>
                            <span className="font-bold">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-red rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {showTier && <TierStatus onClose={(e) => { e.stopPropagation(); setShowTier(false); }} currentPoints={points} />}
            </AnimatePresence>
        </>
    );
};

export default PointsCard;
