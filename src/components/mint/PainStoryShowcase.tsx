
import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, TrendingUp } from 'lucide-react';

const PainStoryShowcase = () => {
  const stories = [
    {
      id: 1,
      story: "Lost everything in Terra Luna. Down 95%. But I'm still here, still fighting. This is my comeback.",
      author: "DiamondHands92",
      likes: 127,
      timeAgo: "2h ago"
    },
    {
      id: 2,
      story: "Been through 3 bear markets. Each one made me stronger. Pain is temporary, but legends are forever.",
      author: "CryptoVeteran",
      likes: 89,
      timeAgo: "4h ago"
    },
    {
      id: 3,
      story: "Started with $100, lost it all, worked 3 jobs to get back in. Never giving up on the dream.",
      author: "Phoenix_Rising",
      likes: 234,
      timeAgo: "6h ago"
    }
  ];

  const [currentStory, setCurrentStory] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStory(prev => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const story = stories[currentStory];

  return (
    <div className="bg-gray-900 border border-purple-500/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="text-purple-400 h-5 w-5" />
        <h3 className="text-lg font-bold text-white">Community Pain Stories</h3>
      </div>
      
      <div className="min-h-[120px] flex flex-col justify-between">
        <p className="text-gray-300 italic mb-3 text-sm leading-relaxed">
          "{story.story}"
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-semibold text-sm">@{story.author}</span>
            <span className="text-gray-500 text-xs">{story.timeAgo}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="text-red-400 h-4 w-4 fill-current" />
            <span className="text-gray-400 text-sm">{story.likes}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-1 mt-3 justify-center">
        {stories.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-6 rounded-full transition-colors ${
              index === currentStory ? 'bg-purple-400' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PainStoryShowcase;
