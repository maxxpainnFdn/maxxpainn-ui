import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Users,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Quote,
  Heart,
} from 'lucide-react';
import Button from './button/Button';
import { SiX } from '@icons-pack/react-simple-icons';
import { useIsMobile } from '@/hooks/useIsMobile';

const Community = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const isMobile = useIsMobile();

  const testimonials = [
    {
      name: 'DegenKing.sol',
      story: 'Lost 50 SOL in rugs. MAXXPAINN gave me purpose again.',
      pain: 'RUGGED 12X',
      rank: 'COMMANDER',
    },
    {
      name: 'LunaVictim',
      story:
        'Terra collapse took everything. This community saved my sanity.',
      pain: 'LUNA SURVIVOR',
      rank: 'VETERAN',
    },
    {
      name: 'LeveredUp',
      story:
        "Liquidated my house deposit. MAXXPAINN is my redemption arc.",
      pain: 'LIQUIDATED',
      rank: 'OFFICER',
    },
    {
      name: 'RugSurvivor',
      story:
        'Every failed project made me stronger. Now we rise together.',
      pain: 'SURVIVOR',
      rank: 'SOLDIER',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {!isMobile ? (
          <>
            <div className="absolute inset-0 opacity-15">
              <div
                className="absolute top-40 right-10 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"
                style={{ animationDuration: '8s' }}
              />
              <div
                className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-pink-500 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"
                style={{ animationDuration: '10s', animationDelay: '2s' }}
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-pink-900/10" />
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-900/50 border border-purple-500/20 mb-8 backdrop-blur-md">
            <Heart className="w-4 h-4 text-purple-500 animate-pulse" />
            <span className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase">
              Join The Movement
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
            <span className="text-white">WE ARE </span>
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              LEGION
            </span>
          </h2>

          <p className="text-lg xs:text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
            <span className="text-white font-bold">127K+ degens</span> who
            earned their spot through pain
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="relative">
            <div className="relative bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-16 overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-red-900/10 opacity-50" />

              <div className="relative z-10">
                <div className="flex justify-center mb-8">
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                    <Quote className="w-8 h-8 text-purple-400" />
                  </div>
                </div>

                <blockquote className="text-center text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold sm:font-bold text-white mb-10 leading-relaxed">
                  "{testimonials[activeTestimonial].story}"
                </blockquote>

                <div className="flex flex-col items-center gap-4">
                  <div className="inline-flex px-4 py-2 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest">
                    {testimonials[activeTestimonial].pain}
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-white mb-1">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">
                      RANK: {testimonials[activeTestimonial].rank}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prev / Next buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group/btn"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-gray-400 group-hover/btn:text-white transition-colors" />
              </button>

              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group/btn"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover/btn:text-white transition-colors" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeTestimonial
                      ? 'w-8 h-2 bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {/* X / Twitter */}
          <a
            href="#"
            className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-black hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <SiX className="w-8 h-8" />
                </div>
                <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                The Loudspeaker
              </h3>
              <p className="text-gray-400 mb-6 flex-grow">
                Alpha calls, shitposting, and coping together. Join the
                conversation.
              </p>
              <div className="flex items-center gap-2 text-blue-400 font-mono text-sm">
                <Users className="w-4 h-4" /> Follow on X
              </div>
            </div>
          </a>

          {/* Telegram Group */}
          <a
            href="#"
            className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-black hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-green-500/10 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <Send className="w-8 h-8" />
                </div>
                <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                The War Room
              </h3>
              <p className="text-gray-400 mb-6 flex-grow">
                Live coordinated raids and mental health support. 24/7 active.
              </p>
              <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                <Users className="w-4 h-4" /> Join Telegram Group
              </div>
            </div>
          </a>

          {/* Telegram Channel */}
          <a
            href="#"
            className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-black hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                The Bunker
              </h3>
              <p className="text-gray-400 mb-6 flex-grow">
                Deep dive research, governance proposals, and roadmap updates.
              </p>
              <div className="flex items-center gap-2 text-purple-400 font-mono text-sm">
                <Users className="w-4 h-4" /> Join Telegram Channel
              </div>
            </div>
          </a>
        </div>

        {/* Final CTA */}
        <div className="text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/30 rounded-full blur-[80px] animate-pulse" />
          <Button variant="secondary" size="lg" className="rounded-2xl">
            JOIN THE REVOLUTION <ArrowRight className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Community;
