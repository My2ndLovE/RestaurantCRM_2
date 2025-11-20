import React, { useState } from 'react';
import { currentUser, transactionHistory, myVouchers } from '../data/mockData';
import { ArrowLeft, History, Ticket, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('history');

    return (
        <div className="min-h-screen bg-brand-bg pb-24">
            {/* Header */}
            <div className="bg-white p-6 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </Link>
                    <h1 className="text-lg font-bold text-brand-text">My Profile</h1>
                    <button className="p-2 -mr-2 rounded-full hover:bg-gray-100">
                        <Settings size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* User Info */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-brand-yellow mb-4 shadow-lg">
                        <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-text">{currentUser.name}</h2>
                    <p className="text-brand-red font-medium">{currentUser.tier}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-4 space-x-4 sticky top-[180px] z-10 bg-brand-bg/95 backdrop-blur-sm">
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-brand-red text-white shadow-lg' : 'bg-white text-gray-500 shadow-sm'}`}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <History size={16} />
                        <span>History</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('vouchers')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'vouchers' ? 'bg-brand-red text-white shadow-lg' : 'bg-white text-gray-500 shadow-sm'}`}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <Ticket size={16} />
                        <span>My Vouchers</span>
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="px-4 space-y-4">
                {activeTab === 'history' ? (
                    <div className="space-y-3">
                        {transactionHistory.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.points > 0 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {item.points > 0 ? '+' : '-'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-brand-text text-sm">{item.description}</p>
                                        <p className="text-xs text-gray-400">{item.date}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${item.points > 0 ? 'text-green-600' : 'text-brand-text'}`}>
                                    {item.points > 0 ? '+' : ''}{item.points}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {myVouchers.map((voucher) => (
                            <motion.div
                                key={voucher.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${voucher.status === 'active' ? 'border-brand-red' : 'border-gray-300 opacity-60'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-brand-text">{voucher.title}</h3>
                                        <p className="text-xs text-gray-500 font-mono mt-1">Code: {voucher.code}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${voucher.status === 'active' ? 'bg-brand-yellow/20 text-brand-text' : 'bg-gray-100 text-gray-500'}`}>
                                        {voucher.status}
                                    </span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Expires: {voucher.expires}</span>
                                    {voucher.status === 'active' && (
                                        <button className="text-xs font-bold text-brand-red">Use Now</button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
