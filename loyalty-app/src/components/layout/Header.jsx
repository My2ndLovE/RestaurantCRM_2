import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NotificationPanel from '../feature/NotificationPanel';

const Header = ({ user, greeting = "Welcome back", logo }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <>
            <header className="flex items-center justify-between p-4 sticky top-0 z-10 shadow-sm/50 backdrop-blur-md overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-white/90 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow/20 via-brand-red/10 to-brand-orange/20 z-0 animate-gradient-x mix-blend-multiply"></div>

                {/* Left: Logo */}
                <div className="flex items-center relative z-10">
                    {logo ? (
                        <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
                    ) : (
                        <h1 className="text-xl font-bold text-brand-text">Happy Potato</h1>
                    )}
                </div>

                {/* Right: User Profile & Bell */}
                <div className="flex items-center space-x-3 relative z-10">
                    <Link to="/profile" className="flex items-center space-x-3 group cursor-pointer">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-500 font-medium">{greeting},</p>
                            <p className="text-sm font-bold text-brand-text leading-none group-hover:text-brand-red transition-colors">{user.name}</p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-brand-yellow overflow-hidden border-2 border-brand-red shadow-md active:scale-95 transition-transform relative group-hover:ring-2 ring-brand-red/30">
                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </Link>

                    <button
                        onClick={() => setShowNotifications(true)}
                        className="p-2 rounded-full hover:bg-gray-100 relative active:scale-95 transition-transform"
                    >
                        <Bell size={20} className="text-gray-600" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
            </AnimatePresence>
        </>
    );
};

export default Header;
