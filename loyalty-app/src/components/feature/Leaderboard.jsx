import React from 'react';
import { Trophy, Medal, User } from 'lucide-react';

const LEADERS = [
    { id: 1, name: 'Sarah M.', points: 5400, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 2, name: 'Mike R.', points: 4850, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { id: 3, name: 'Alex Johnson', points: 1250, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', isCurrentUser: true },
    { id: 4, name: 'Jessica T.', points: 980, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
    { id: 5, name: 'David K.', points: 850, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
];

const Leaderboard = () => {
    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-brand-text flex items-center gap-3">
                    <div className="bg-brand-yellow/10 p-2.5 rounded-full">
                        <Trophy size={24} className="text-brand-yellow" />
                    </div>
                    Top Eaters
                </h2>
                <span className="text-xs font-bold text-brand-red bg-brand-red/10 px-3 py-1.5 rounded-full tracking-wide uppercase">
                    Weekly
                </span>
            </div>

            <div className="space-y-3">
                {LEADERS.map((leader, index) => (
                    <div
                        key={leader.id}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all ${leader.isCurrentUser
                                ? 'bg-brand-yellow/10 border-2 border-brand-yellow/20 shadow-sm'
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-8 text-center font-black text-gray-400 text-lg">
                                {index === 0 ? <Medal size={24} className="text-yellow-500 mx-auto drop-shadow-sm" /> :
                                    index === 1 ? <Medal size={24} className="text-gray-400 mx-auto drop-shadow-sm" /> :
                                        index === 2 ? <Medal size={24} className="text-orange-400 mx-auto drop-shadow-sm" /> :
                                            `#${index + 1}`}
                            </div>
                            <div className="relative">
                                <img src={leader.avatar} alt={leader.name} className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm" />
                                {leader.isCurrentUser && (
                                    <div className="absolute -bottom-1 -right-1 bg-brand-red border-2 border-white w-4 h-4 rounded-full" />
                                )}
                            </div>
                            <div>
                                <p className={`text-sm sm:text-base font-bold ${leader.isCurrentUser ? 'text-brand-text' : 'text-gray-600'}`}>
                                    {leader.name} {leader.isCurrentUser && <span className="text-brand-red ml-1">(You)</span>}
                                </p>
                            </div>
                        </div>
                        <span className="font-black text-brand-red text-sm sm:text-base">{leader.points.toLocaleString()} pts</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
