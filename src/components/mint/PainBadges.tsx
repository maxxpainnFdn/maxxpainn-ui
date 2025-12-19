
import React from 'react';
import { Shield, Crown, Flame, Star, Zap } from 'lucide-react';

interface PainBadgesProps {
  lockPeriod: number;
}

const PainBadges = ({ lockPeriod }: PainBadgesProps) => {
 
  const getBadges = () => {
    const allBadges = [
      { name: 'Pain Initiate', icon: Shield, color: 'text-gray-400', bgColor: 'from-gray-600 to-gray-700', minDays: 1 },
      { name: 'Weekly Warrior', icon: Zap, color: 'text-yellow-400', bgColor: 'from-yellow-600 to-yellow-700', minDays: 7 },
      { name: 'Monthly Martyr', icon: Flame, color: 'text-orange-400', bgColor: 'from-orange-600 to-orange-700', minDays: 30 },
      { name: 'Yearly Legend', icon: Crown, color: 'text-purple-400', bgColor: 'from-purple-600 to-purple-700', minDays: 365 },
      { name: 'Ultimate Degen', icon: Star, color: 'text-red-400', bgColor: 'from-red-600 to-red-700', minDays: 500 },
    ];

    return allBadges.map(badge => ({
      ...badge,
      unlocked: lockPeriod >= badge.minDays
    }));
  };

  const badges = getBadges();

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-4">Pain Badges</h3>
      
      <div className="space-y-3">
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div 
              key={idx} 
              className={`
                flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                ${badge.unlocked 
                  ? `bg-gradient-to-r ${badge.bgColor} border-2 border-opacity-50 shadow-lg` 
                  : 'bg-gray-800/40 border-2 border-gray-700/30 opacity-40 grayscale'
                }
              `}
            >
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                ${badge.unlocked ? 'bg-black/30' : 'bg-gray-700/50'}
              `}>
                <Icon className={`w-6 h-6 ${badge.unlocked ? badge.color : 'text-gray-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold ${badge.unlocked ? 'text-white' : 'text-gray-600'}`}>
                  {badge.name}
                </div>
                <div className="text-xs text-gray-200 font-medium mt-1">
                  {badge.unlocked ? 'Unlocked' : `Requires ${badge.minDays} days`}
                </div>
              </div>
              {badge.unlocked && (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PainBadges;
