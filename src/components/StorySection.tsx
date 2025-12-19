
import React from 'react';
import { Card } from '@/components/ui/card';

const StorySection = () => {
  const painPoints = [
    {
      title: "The Luna Massacre",
      description: "Remember when LUNA went from $80 to $0.0001? We were there.",
      icon: "🌙",
      loss: "$60B"
    },
    {
      title: "FTX Betrayal", 
      description: "Trusted the exchange, lost everything overnight.",
      icon: "💔",
      loss: "$8B"
    },
    {
      title: "Endless Rugs",
      description: "How many 'moonshot' projects vanished with our hopes?",
      icon: "🪦",
      loss: "$10B+"
    },
    {
      title: "Liquidation Hell",
      description: "Leveraged trades gone wrong, dreams crushed in seconds.",
      icon: "⚡",
      loss: "$50B+"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-purple-950/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Our Shared Pain</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Every degen has a story. Every loss made us stronger. 
            MAXXPAINN transforms collective trauma into unstoppable power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, index) => (
            <Card 
              key={index} 
              className="bg-black/60 border-red-500/30 hover:border-red-500/60 transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="p-6 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {point.icon}
                </div>
                <h3 className="text-xl font-bold text-red-400 mb-3">{point.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{point.description}</p>
                <div className="text-2xl font-bold text-red-500">{point.loss}</div>
                <div className="text-xs text-gray-500">Lost Forever</div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold mb-4 gradient-text">
              From Ashes, We Rise
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              Every crash, every rug, every liquidation was a lesson. Now we turn that pain into power.
              MAXXPAINN isn't just another token - it's our collective middle finger to the manipulators.
            </p>
            <div className="text-purple-400 font-semibold text-xl">
              Pain → Power → Profit
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
