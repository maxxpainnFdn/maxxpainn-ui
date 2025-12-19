
import React, { useState, useEffect } from 'react';
import { Zap, Flame, Star } from 'lucide-react';

interface TokenAnimationProps {
  isActive: boolean;
  amount: string;
}

const TokenAnimation = ({ isActive, amount }: TokenAnimationProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setParticles(newParticles);
      
      const timeout = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  return (
    <div className="relative h-32 bg-gray-900 border border-purple-500/20 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-4xl font-black transition-all duration-1000 ${
          isActive ? 'animate-pulse scale-110 gradient-text' : 'text-gray-400'
        }`}>
          {amount || '0'} PAINN
        </div>
      </div>
      
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-ping"
          style={{ 
            left: `${particle.x}%`, 
            top: `${particle.y}%`,
            animationDelay: `${particle.id * 0.1}s`
          }}
        >
          {particle.id % 3 === 0 ? (
            <Zap className="text-yellow-400 h-4 w-4" />
          ) : particle.id % 3 === 1 ? (
            <Flame className="text-red-400 h-4 w-4" />
          ) : (
            <Star className="text-purple-400 h-4 w-4" />
          )}
        </div>
      ))}
    </div>
  );
};

export default TokenAnimation;
