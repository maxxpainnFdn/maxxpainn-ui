
import React from 'react';
import { Zap, Flame, Skull } from 'lucide-react';

interface PainMeterProps {
  lockPeriod: number;
  maxLockPeriod: number;
}

const PainMeter = ({ lockPeriod, maxLockPeriod }: PainMeterProps) => {
  
  let lockPercent = Number(((lockPeriod / maxLockPeriod) * 100).toFixed(1));

  const getPainLevel = () => {
    if (lockPercent < 15) return { 
      level: 'Mild', 
      intensity: lockPercent, 
      color: 'from-yellow-400 to-yellow-500',
      textColor: 'text-yellow-400',
      icon: Zap 
    };
    if (lockPercent < 35) return { 
      level: 'Moderate', 
      intensity: lockPercent, 
      color: 'from-orange-400 to-orange-500',
      textColor: 'text-orange-400',
      icon: Flame 
    };
    if (lockPercent < 65) return { 
      level: 'Intense', 
      intensity: lockPercent, 
      color: 'from-red-400 to-red-500',
      textColor: 'text-red-400',
      icon: Flame 
    };
    if (lockPercent < 85) return { 
      level: 'Extreme', 
      intensity: lockPercent, 
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-500',
      icon: Flame 
    };
    return { 
      level: 'LEGENDARY', 
      intensity: 100, 
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400',
      icon: Flame 
    };
  };

  const pain = getPainLevel();
  const Icon = pain.icon;

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Pain Intensity</h3>
          <Icon className="w-6 h-6 text-orange-400" />
        </div>
        
        <div className="space-y-4">
          <div className="relative h-8 pain-meter bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${pain.color} rounded-full transition-all duration-500`}
              style={{ width: `${(lockPeriod / maxLockPeriod) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-white">{pain.level}</span>
            <span className="text-gray-400">{Math.round((lockPeriod / maxLockPeriod) * 100)}% Commitment</span>
          </div>
        </div>
      </div>
  );
}

export default PainMeter;
