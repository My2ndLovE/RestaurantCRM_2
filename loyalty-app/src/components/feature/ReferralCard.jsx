import React from 'react';
import { Users, Copy, Share2 } from 'lucide-react';

const ReferralCard = () => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 text-brand-text text-left">
            <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                    <Users size={24} className="text-purple-600" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Invite Friends</h3>
                    <p className="text-sm text-gray-500 mb-4">Earn 500 points for every friend who signs up and makes their first purchase!</p>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center mb-3">
                        <span className="font-mono font-bold text-gray-600 tracking-wider">ALEX-9921</span>
                        <button className="text-brand-red font-bold text-xs flex items-center hover:underline">
                            <Copy size={14} className="mr-1" /> Copy
                        </button>
                    </div>

                    <button className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors">
                        <Share2 size={18} />
                        <span>Share Link</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReferralCard;
