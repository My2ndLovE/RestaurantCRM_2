import React from 'react';
import { X, Bell, Gift, Star, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIFICATIONS = [
    { id: 1, type: 'reward', title: 'Reward Unlocked!', message: 'You have enough points for a Free Cheese Dip.', time: '2m ago', read: false },
    { id: 2, type: 'info', title: 'Double Points Weekend', message: 'Earn 2x points on all orders this Saturday!', time: '1h ago', read: false },
    { id: 3, type: 'system', title: 'Welcome to Happy Potato!', message: 'Thanks for joining our loyalty program.', time: '1d ago', read: true },
];

const NotificationPanel = ({ onClose }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose}></div>
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col"
            >
                <div className="p-4 border-b flex justify-between items-center bg-brand-bg">
                    <h2 className="font-bold text-lg text-brand-text flex items-center">
                        <Bell size={20} className="mr-2 text-brand-red" />
                        Notifications
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {NOTIFICATIONS.map((notif) => (
                        <div key={notif.id} className={`p-3 rounded-xl border ${notif.read ? 'bg-gray-50 border-gray-100' : 'bg-white border-brand-yellow/30 shadow-sm'}`}>
                            <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-full flex-shrink-0 ${notif.type === 'reward' ? 'bg-red-100 text-brand-red' :
                                    notif.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {notif.type === 'reward' ? <Gift size={16} /> :
                                        notif.type === 'info' ? <Star size={16} /> : <Info size={16} />}
                                </div>
                                <div>
                                    <h3 className={`text-sm font-bold ${notif.read ? 'text-gray-600' : 'text-brand-text'}`}>{notif.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                                    <span className="text-[10px] text-gray-400 mt-2 block">{notif.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </>
    );
};

export default NotificationPanel;
