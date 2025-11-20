import React from 'react';
import { X, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedIcon from './AnimatedIcon';

const RedeemModal = ({ offer, onClose, onConfirm }) => {
    if (!offer) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pb-28 sm:pb-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="bg-white w-full max-w-md rounded-3xl p-6 relative max-h-[85vh] overflow-y-auto"
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg mb-4 border-4 border-brand-bg">
                        <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                    </div>

                    <span className="text-brand-red font-bold tracking-widest uppercase text-xs mb-2">Confirm Redemption</span>
                    <h2 className="text-2xl font-bold text-brand-text mb-2">{offer.title}</h2>
                    <p className="text-gray-500 text-sm mb-6 px-4">{offer.description}</p>

                    <div className="flex items-center justify-center space-x-2 bg-brand-bg px-4 py-2 rounded-lg mb-6 border border-brand-yellow/30">
                        <span className="text-brand-text font-bold">Cost:</span>
                        <span className="text-brand-red font-bold text-lg">{offer.pointsCost > 0 ? `${offer.pointsCost} Pts` : 'Free'}</span>
                    </div>

                    <button
                        onClick={onConfirm}
                        className="w-full bg-brand-red text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-red/30 active:scale-95 transition-transform flex items-center justify-center space-x-2 hover:bg-brand-red/90"
                    >
                        <AnimatedIcon animation="bounce" size="sm">
                            <Gift size={20} />
                        </AnimatedIcon>
                        <span>Redeem Now</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default RedeemModal;
