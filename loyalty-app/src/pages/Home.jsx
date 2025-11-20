import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import PointsCard from '../components/feature/PointsCard';
import DailyCheckIn from '../components/feature/DailyCheckIn';
import RedeemModal from '../components/feature/RedeemModal';
import SuccessAnimation from '../components/feature/SuccessAnimation';
import { currentUser, activeOffers, brandAssets } from '../data/mockData';
import { ArrowRight, Clock, Flame, Scan, Dices } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import successData from '../assets/lottie/success.json';

const HERO_SLIDES = [
    { id: 1, image: brandAssets.banner1, title: "Crispy Truffle Fries", tag: "New Arrival" },
    { id: 2, image: brandAssets.banner2, title: "Double Cheese Burger", tag: "Best Seller" },
    { id: 3, image: brandAssets.banner3, title: "Spicy Chicken Wings", tag: "Limited Time" },
    { id: 4, image: brandAssets.banner4, title: "Family Feast Combo", tag: "Great Value" },
];

const Home = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    const [selectedOffer, setSelectedOffer] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-rotate slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleDragEnd = (event, info) => {
        if (info.offset.x < -50) {
            // Swipe Left (Next Slide)
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        } else if (info.offset.x > 50) {
            // Swipe Right (Prev Slide)
            setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
        }
    };

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-brand-bg pb-24">
            <Header user={currentUser} greeting={greeting} logo={brandAssets.logo} />

            <motion.main
                className="px-4 space-y-6 mt-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Hero Banner Carousel */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl overflow-hidden shadow-md mx-2 relative group h-48 touch-pan-y"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                        >
                            <img
                                src={HERO_SLIDES[currentSlide].image}
                                alt={HERO_SLIDES[currentSlide].title}
                                className="w-full h-full object-cover pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 pointer-events-none">
                                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="bg-brand-yellow text-brand-text text-xs font-bold px-2 py-1 rounded-md mb-1 inline-block">
                                        {HERO_SLIDES[currentSlide].tag}
                                    </span>
                                    <h2 className="text-white font-bold text-lg leading-tight">
                                        {HERO_SLIDES[currentSlide].title}
                                    </h2>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Carousel Indicators */}
                    <div className="absolute bottom-4 right-4 flex space-x-1.5 z-10">
                        {HERO_SLIDES.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-4 bg-brand-yellow' : 'w-1.5 bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Points Section */}
                <motion.section variants={itemVariants} className="px-2">
                    <PointsCard points={currentUser.points} nextReward={currentUser.nextReward} />
                </motion.section>

                {/* Secondary Banners Grid */}
                <motion.section variants={itemVariants} className="grid grid-cols-2 gap-3 px-2">
                    <motion.div whileHover={{ y: -5 }} className="rounded-xl overflow-hidden shadow-sm h-32 relative group cursor-pointer">
                        <img src={brandAssets.subBanner1} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Promo 1" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-end p-3">
                            <span className="text-white font-bold text-sm drop-shadow-md">New Flavors</span>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="rounded-xl overflow-hidden shadow-sm h-32 relative group cursor-pointer">
                        <img src={brandAssets.subBanner2} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Promo 2" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-end p-3">
                            <span className="text-white font-bold text-sm drop-shadow-md">Best Sellers</span>
                        </div>
                    </motion.div>
                </motion.section>

                {/* Daily Check-in */}
                <motion.section variants={itemVariants} className="px-2">
                    <DailyCheckIn />
                </motion.section>

                {/* Quick Actions */}
                <motion.section variants={itemVariants} className="grid grid-cols-2 gap-3 px-2">
                    <Link to="/earn" className="bg-brand-yellow p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform relative overflow-hidden group">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-brand-text shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Scan size={24} />
                        </div>
                        <span className="font-bold text-brand-text text-sm">Scan Receipt</span>
                    </Link>
                    <Link to="/game" className="bg-brand-red p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform relative overflow-hidden text-white group">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                            <Dices size={24} />
                        </div>
                        <span className="font-bold text-white text-sm">Spin & Win</span>
                    </Link>
                </motion.section>

                {/* Active Offers */}
                <motion.section variants={itemVariants} className="px-2">
                    <div className="flex justify-between items-center mb-3 px-1">
                        <h2 className="text-lg font-bold text-brand-text flex items-center">
                            <Flame size={18} className="mr-2 text-orange-500" />
                            Hot Deals
                        </h2>
                        <Link to="/rewards" className="text-brand-red text-sm font-bold flex items-center hover:underline">
                            View All <ArrowRight size={14} className="ml-1" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {activeOffers.map((offer) => (
                            <motion.div
                                key={offer.id}
                                onClick={() => handleRedeemClick(offer)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white rounded-2xl p-3 shadow-sm flex space-x-4 border border-brand-yellow/20 cursor-pointer"
                            >
                                <img src={offer.image} alt={offer.title} className="w-24 h-24 rounded-xl object-cover bg-gray-100 shadow-sm" />
                                <div className="flex-1 py-1 flex flex-col justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-0.5 bg-brand-yellow/20 text-brand-text text-[10px] font-bold uppercase tracking-wider rounded-full mb-1">{offer.type}</span>
                                        <h3 className="font-bold text-brand-text leading-tight mb-1">{offer.title}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">{offer.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center text-xs text-gray-400">
                                            <Clock size={12} className="mr-1" />
                                            {offer.expires}
                                        </div>
                                        <span className="text-brand-red font-bold text-xs bg-brand-red/10 px-2 py-1 rounded-lg">
                                            {offer.pointsCost > 0 ? `${offer.pointsCost} Pts` : 'Free'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </motion.main>

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

export default Home;
