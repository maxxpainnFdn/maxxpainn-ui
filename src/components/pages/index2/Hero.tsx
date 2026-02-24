
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const [painLevel, setPainLevel] = useState(0);
  const [currentStory, setCurrentStory] = useState(0);

  const painStories = [
    "Lost everything in Luna Terra collapse...",
    "Liquidated during the FTX crash...",
    "Rugged by another 'safe' project...",
    "Watching portfolio bleed red..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPainLevel(prev => (prev < 100 ? prev + 1 : 0));
    }, 50);

    const storyTimer = setInterval(() => {
      setCurrentStory(prev => (prev + 1) % painStories.length);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(storyTimer);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-purple-950/20 to-black">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full float-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        {/* Main title with glitch effect */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 glitch-effect">
          <span className="gradient-text">MAXX</span>
          <span className="text-red-500">PAINN</span>
        </h1>

        {/* Subtitle with typewriter effect */}
        <div className="text-xl md:text-2xl text-gray-300 mb-8 h-8">
          <span className="opacity-60">{painStories[currentStory]}</span>
        </div>

        {/* Pain transformation meter */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>PAIN</span>
            <span>{painLevel}%</span>
            <span>GAIN</span>
          </div>
          <div className="maxx-meter">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-75"
              style={{ width: `${painLevel}%` }}
            />
          </div>
        </div>

        {/* Main message */}
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          We've all been there. The rugs, the liquidations, the sleepless nights watching red candles.
          <br />
          <span className="text-purple-400 font-semibold">But pain breeds strength. Loss creates legends.</span>
          <br />
          MAXXPAINN is your redemption story - a free mint for every degen who's been burned.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-bold neon-glow transform hover:scale-105 transition-all duration-300"
            size="lg"
          >
            CLAIM YOUR PAIN 🔥
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-4 text-lg"
            size="lg"
          >
            Read Manifesto
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-red-400 mb-2">$2.1B+</div>
            <div className="text-gray-400">Collective Pain</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-purple-400 mb-2">100K+</div>
            <div className="text-gray-400">Degens United</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">FREE</div>
            <div className="text-gray-400">Mint for All</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
