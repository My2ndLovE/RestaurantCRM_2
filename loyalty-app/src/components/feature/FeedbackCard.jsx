import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessAnimation from './SuccessAnimation';
import successData from '../../assets/lottie/success.json';

const FeedbackCard = () => {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleSubmit = () => {
        if (rating > 0) {
            setSubmitted(true);
            setShowSuccess(true);
        }
    };

    const handleComplete = () => {
        setShowSuccess(false);
        // Reset the form after a short delay
        setTimeout(() => {
            setSubmitted(false);
            setRating(0);
        }, 300);
    };

    if (submitted && !showSuccess) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200 text-center h-48 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Star size={32} className="text-green-600 fill-green-600" />
                </div>
                <h3 className="font-bold text-brand-text mb-1">Thanks for your feedback!</h3>
                <p className="text-sm text-gray-500">You earned 50 points.</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-yellow/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-brand-yellow text-brand-text text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                    +50 Points
                </div>

                <h3 className="font-bold text-brand-text text-lg mb-1">Rate your last meal</h3>
                <p className="text-gray-500 text-sm mb-4">How were the Spicy Chicken Wings?</p>

                <div className="flex justify-center space-x-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        >
                            <Star
                                size={32}
                                className={`${(hoveredStar || rating) >= star ? 'fill-brand-yellow text-brand-yellow' : 'text-gray-300'}`}
                                strokeWidth={2}
                            />
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${rating > 0
                        ? 'bg-brand-red text-white shadow-md hover:bg-brand-red/90 active:scale-95'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <span>Submit Review</span>
                    <Send size={16} />
                </button>
            </div>

            {/* Success Animation Modal */}
            {showSuccess && (
                <SuccessAnimation
                    animationData={successData}
                    message="Thanks!"
                    subMessage="You earned 50 points for your feedback."
                    onComplete={handleComplete}
                />
            )}
        </>
    );
};

export default FeedbackCard;
