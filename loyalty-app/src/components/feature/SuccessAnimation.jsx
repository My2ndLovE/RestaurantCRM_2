import React from 'react';
import Lottie from 'lottie-react';

const SuccessAnimation = ({ animationData, message, subMessage, onComplete }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl transform transition-all scale-100">
                <div className="w-48 h-48 mx-auto mb-4">
                    <Lottie
                        animationData={animationData}
                        loop={false}
                        onComplete={onComplete}
                        autoPlay={true}
                    />
                </div>
                <h2 className="text-2xl font-bold text-brand-text mb-2">{message}</h2>
                <p className="text-gray-500 mb-6">{subMessage}</p>
                <button
                    onClick={onComplete}
                    className="w-full bg-brand-red text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-red/90 transition-colors"
                >
                    Awesome!
                </button>
            </div>
        </div>
    );
};

export default SuccessAnimation;
