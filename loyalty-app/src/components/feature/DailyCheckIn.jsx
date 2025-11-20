import React, { useState } from 'react';
import { Check, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedIcon from './AnimatedIcon';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const DailyCheckIn = () => {
    const [checkedIn, setCheckedIn] = useState(false);
    const [streak, setStreak] = useState(3);

    const handleCheckIn = () => {
        if (!checkedIn) {
            setCheckedIn(true);
            setStreak(s => s + 1);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-bold text-brand-text">Daily Streak</h3>
                    <p className="text-xs text-gray-500">Check in daily to earn bonus points!</p>
                </div>
                <div className="flex items-center space-x-1 bg-orange-100 px-2 py-1 rounded-lg">
                    <span className="text-orange-600 font-bold text-sm">🔥 {streak} Days</span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                {DAYS.map((day, index) => {
                    // Mock logic: Days 0-2 are checked, 3 is today, 4-6 are future
                    const isPast = index < 3;
                    const isToday = index === 3;

                    return (
                        <div key={index} className="flex flex-col items-center space-y-1">
                            <span className="text-[10px] text-gray-400 font-bold">{day}</span>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${isPast ? 'bg-brand-red text-white' : ''}
                  ${isToday && checkedIn ? 'bg-brand-red text-white scale-110' : ''}
                  ${isToday && !checkedIn ? 'bg-brand-accent text-white animate-pulse cursor-pointer' : ''}
                  ${!isPast && !isToday ? 'bg-gray-100 text-gray-300' : ''}
                `}
                                onClick={isToday ? handleCheckIn : undefined}
                            >
                                {isPast || (isToday && checkedIn) ? <Check size={14} /> : (isToday ? <Gift size={14} /> : '+5')}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!checkedIn && (
                <button
                    onClick={handleCheckIn}
                    className="w-full bg-brand-red text-white font-bold py-2 rounded-xl text-sm hover:bg-brand-red/90 transition-colors"
                >
                    Claim Daily Bonus (+10 Pts)
                </button>
            )}
            {checkedIn && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full bg-green-100 text-green-700 font-bold py-2 rounded-xl text-sm text-center flex items-center justify-center space-x-2"
                >
                    <AnimatedIcon animation="bounce" size="sm">
                        <Check size={16} className="text-green-700" />
                    </AnimatedIcon>
                    <span>Bonus Claimed! Come back tomorrow.</span>
                </motion.div>
            )}
        </div>
    );
};

export default DailyCheckIn;
