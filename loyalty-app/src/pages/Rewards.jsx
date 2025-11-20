import React, { useState } from 'react';
import { activeOffers } from '../data/mockData';
import RedeemModal from '../components/feature/RedeemModal';
import SuccessAnimation from '../components/feature/SuccessAnimation';
import successData from '../assets/lottie/success.json';
import { AnimatePresence } from 'framer-motion';

const Rewards = () => {
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleRedeemClick = (offer) => {
        setSelectedOffer(offer);
    };

    const confirmRedeem = () => {
        setSelectedOffer(null);
        // Simulate API call
        setTimeout(() => {
            setShowSuccess(true);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-brand-bg pb-24 p-6">
            <h1 className="text-2xl font-bold text-brand-text mb-6">Rewards Menu</h1>

            <div className="grid grid-cols-1 gap-4">
                {/* Example Rewards List */}
                {[...activeOffers, ...activeOffers].map((offer, index) => (
                    <div key={`${offer.id}-${index}`} className="bg-white rounded-2xl p-4 shadow-sm flex space-x-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-brand-text">{offer.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">{offer.description}</p>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <span className="font-bold text-brand-red">{offer.pointsCost > 0 ? `${offer.pointsCost} Pts` : 'Free'}</span>
                                <button
                                    onClick={() => handleRedeemClick(offer)}
                                    className="bg-brand-red text-white text-xs font-bold py-2 px-4 rounded-lg active:scale-95 transition-transform shadow-md hover:bg-brand-red/90"
                                >
                                    Redeem
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedOffer && (
                    <RedeemModal
                        offer={selectedOffer}
                        onClose={() => setSelectedOffer(null)}
                        onConfirm={confirmRedeem}
                    />
                )}
            </AnimatePresence>

            {showSuccess && (
                <SuccessAnimation
                    animationData={successData}
                    message="Redeemed!"
                    subMessage="Enjoy your reward. Show this to the staff."
                    onComplete={() => setShowSuccess(false)}
                />
            )}
        </div>
    );
};

export default Rewards;
