import React from 'react';
import { QrCode, Camera, Share2 } from 'lucide-react';
import ReferralCard from '../components/feature/ReferralCard';
import FeedbackCard from '../components/feature/FeedbackCard';
import { motion } from 'framer-motion';

const Earn = () => {
    return (
        <div className="min-h-screen bg-brand-bg pb-24 p-4 space-y-6">
            <header className="mt-2">
                <h1 className="text-3xl font-bold text-brand-text">Earn Points</h1>
                <p className="text-gray-500">Collect points for every purchase!</p>
            </header>

            {/* Scan QR Section */}
            <section className="bg-brand-red rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Scan & Earn</h2>
                            <p className="text-white/80 text-sm">Scan the QR code on your receipt</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <QrCode size={24} />
                        </div>
                    </div>

                    <button className="w-full bg-white text-brand-red font-bold py-3 rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition-transform shadow-md">
                        <Camera size={20} />
                        <span>Open Camera</span>
                    </button>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-yellow/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
            </section>

            {/* Feedback Section */}
            <section>
                <FeedbackCard />
            </section>

            {/* Referral Section */}
            <section>
                <ReferralCard />
            </section>
        </div>
    );
};

export default Earn;
