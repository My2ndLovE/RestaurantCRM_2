import React from 'react';
import { Home, Gift, User, Scan, Dices } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/earn', icon: Scan, label: 'Earn' },
        { path: '/game', icon: Dices, label: 'Game', isSpecial: true },
        { path: '/rewards', icon: Gift, label: 'Rewards' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
            <div className="flex justify-between items-end max-w-md mx-auto relative">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    if (item.isSpecial) {
                        return (
                            <div key={item.path} className="relative -top-6">
                                <NavLink
                                    to={item.path}
                                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-lg transform transition-transform active:scale-95 border-4 ${isActive
                                        ? 'bg-brand-red text-white ring-4 ring-brand-red/20 border-white'
                                        : 'bg-brand-red text-white border-white'
                                        }`}
                                >
                                    <item.icon size={28} />
                                </NavLink>
                            </div>
                        );
                    }

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center py-2 w-14 space-y-1 transition-colors relative ${isActive ? 'text-brand-red' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="navIndicator"
                                    className="absolute -top-2 w-8 h-1 bg-brand-red rounded-full"
                                />
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
