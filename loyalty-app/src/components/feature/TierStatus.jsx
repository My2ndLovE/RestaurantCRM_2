import React from 'react';
import { X, CheckCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const BENEFITS = [
    { tier: 'Silver', benefits: ['Earn 1pt per $1', 'Birthday Treat'], unlocked: true },
    { tier: 'Gold', benefits: ['Earn 1.5pts per $1', 'Free Upsize', 'Priority Booking'], unlocked: true },
    { tier: 'Platinum', benefits: ['Earn 2pts per $1', 'Chef\'s Special Access', 'No Expiry Points'], unlocked: false },
];

const TierStatus = ({ onClose, currentPoints }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="bg-white w-full max-w-md rounded-3xl p-6 relative max-h-[80vh] overflow-y-auto"
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full">
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <span className="text-brand-red font-bold tracking-widest uppercase text-xs">Current Status</span>
                    <h2 className="text-3xl font-bold text-brand-text mt-1">Potato Lover</h2>
                    <p className="text-gray-500 text-sm mt-2">You need 250 more points for Potato Master</p>

                    <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-yellow to-brand-red w-[80%]"></div>
                    </div>
                </div>

                <div className="space-y-6">
                    {BENEFITS.map((tier, index) => (
                        <div key={index} className={`relative pl-8 pb-6 border-l-2 ${tier.unlocked ? 'border-brand-red' : 'border-gray-200'}`}>
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${tier.unlocked ? 'bg-brand-red border-brand-red' : 'bg-white border-gray-300'}`}></div>

                            <h3 className={`font-bold text-lg ${tier.unlocked ? 'text-brand-text' : 'text-gray-400'}`}>{tier.tier}</h3>
                            <ul className="mt-2 space-y-2">
                                {tier.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-center text-sm text-gray-600">
                                        {tier.unlocked ? (
                                            <CheckCircle size={14} className="text-brand-red mr-2" />
                                        ) : (
                                            <Lock size={14} className="text-gray-300 mr-2" />
                                        )}
                                        <span className={tier.unlocked ? '' : 'text-gray-400'}>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default TierStatus;
