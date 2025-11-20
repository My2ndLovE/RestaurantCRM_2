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
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-brand-text flex items-center">
                    <Trophy size={20} className="text-brand-yellow mr-2" />
                    Top Eaters
                </h2>
                <span className="text-xs font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded-lg">Weekly</span>
            </div>

            <div className="space-y-4">
                {LEADERS.map((leader, index) => (
                    <div
                        key={leader.id}
                        className={`flex items-center justify-between p-3 rounded-xl ${leader.isCurrentUser ? 'bg-brand-yellow/10 border border-brand-yellow/30' : 'hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-6 text-center font-bold text-gray-400">
                                {index === 0 ? <Medal size={20} className="text-yellow-500 mx-auto" /> :
                                    index === 1 ? <Medal size={20} className="text-gray-400 mx-auto" /> :
                                        index === 2 ? <Medal size={20} className="text-orange-400 mx-auto" /> :
                                            `#${index + 1}`}
                            </div>
                            <img src={leader.avatar} alt={leader.name} className="w-8 h-8 rounded-full bg-gray-200" />
                            <div>
                                <p className={`text-sm font-bold ${leader.isCurrentUser ? 'text-brand-text' : 'text-gray-600'}`}>
                                    {leader.name} {leader.isCurrentUser && '(You)'}
                                </p>
                            </div>
                        </div>
                        <span className="font-bold text-brand-red text-sm">{leader.points.toLocaleString()} pts</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
