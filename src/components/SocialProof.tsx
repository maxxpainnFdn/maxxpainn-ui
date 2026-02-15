import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  MessageCircle,
  Users,
  TrendingUp,
  ShieldAlert,
  Quote,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

const SocialProof = () => {
  const isMobile = useIsMobile();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarousel, setIsCarousel] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    // Check for max-width md (768px)
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsCarousel(e.matches);
    
    // Set initial state
    handler(mq);
    
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const testimonials = [
    {
      text: "I lost 80% in the Luna crash. I was ready to quit crypto forever. MAXXPAINN is the first project that actually understands the anger.",
      author: 'DegenApe',
      handle: '@wagmi_420',
      pain: 'LUNA SURVIVOR',
      avatar: 'DA',
    },
    {
      text: "Been rugged 6 times this year alone. It's exhausting. This free mint feels like the community taking power back.",
      author: 'CryptoSurvivor',
      handle: '@rekt_again',
      pain: 'SERIAL RUG VICTIM',
      avatar: 'CS',
    },
    {
      text: "FTX took my life savings. This art speaks to my soul. We turn pain into power. LFG! 🔥",
      author: 'SolanaMaxi',
      handle: '@ftx_refund_wen',
      pain: 'FTX CREDITOR',
      avatar: 'SM',
    },
    {
      text: "From -$50k to believing again. The roadmap is solid, but the message is what sold me. We are legion.",
      author: 'DiamondHands',
      handle: '@hodl_forever',
      pain: 'LIQUIDATION KING',
      avatar: 'DH',
    },
    {
      text: "Finally, a project that doesn't promise 'utility' but delivers straight facts. The art is sick.",
      author: 'NFT_Collector',
      handle: '@jpeg_enjoyer',
      pain: 'GAS WAR VETERAN',
      avatar: 'NC',
    },
    {
      text: 'Join the discord, the vibes are different here. No moonboi spam, just real people who survived the bear market.',
      author: 'BearMarketBuilder',
      handle: '@build_or_die',
      pain: 'COMMUNITY OG',
      avatar: 'BB',
    },
  ];

  const stats = [
    {
      label: 'Pain Stories Shared',
      value: '47K+',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Degens United',
      value: '89K+',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Collective Losses',
      value: '$3.2B+',
      icon: <ShieldAlert className="w-6 h-6" />,
      color: 'from-red-500 to-orange-500',
    },
    {
      label: 'Already Minted',
      value: '12.8K',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  // 2 cols × 2 rows = 4 cards per slide
  const CARDS_PER_SLIDE = 4;
  const totalSlides = Math.ceil(testimonials.length / CARDS_PER_SLIDE);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
  };

  const getSlideItems = (slideIndex) => {
    const start = slideIndex * CARDS_PER_SLIDE;
    // We want exactly 4 items per slide to maintain the grid shape, 
    // filling with null if we run out of items, or just mapping what we have.
    // However, CSS grid handles missing items gracefully by just leaving the cell empty.
    return testimonials.slice(start, start + CARDS_PER_SLIDE);
  };

  const TestimonialCard = ({ item, compact = false }) => (
    <div
      className={`group relative bg-gray-900/40 backdrop-blur-2xl border border-white/10 overflow-hidden transition-all duration-500 ${
        compact
          ? 'rounded-2xl p-3 h-full flex flex-col justify-between'
          : 'rounded-3xl p-8 hover:-translate-y-2 hover:border-purple-500/30 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)]'
      } hover:bg-gray-900/60`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div
        className={`absolute text-white/5 group-hover:text-white/10 transition-colors ${
          compact ? 'top-2 right-2' : 'top-6 right-6'
        }`}
      >
        <Quote size={compact ? 24 : 48} />
      </div>

      <div className="relative z-10">
        <div className={`flex items-center gap-2 ${compact ? 'mb-2' : 'mb-6'}`}>
          <div
            className={`rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-white/20 flex items-center justify-center font-black text-white shadow-lg flex-shrink-0 ${
              compact ? 'w-7 h-7 text-[9px]' : 'w-12 h-12 text-sm'
            }`}
          >
            {item.avatar}
          </div>
          <div className="min-w-0">
            <div
              className={`font-bold text-white truncate ${
                compact ? 'text-[11px]' : 'text-base'
              }`}
            >
              {item.author}
            </div>
            <div
              className={`text-gray-500 truncate ${
                compact ? 'text-[9px]' : 'text-xs'
              }`}
            >
              {item.handle}
            </div>
          </div>
        </div>

        <div
          className={`inline-flex items-center rounded-full bg-red-950/30 border border-red-500/20 text-red-400 font-bold uppercase tracking-wider ${
            compact
              ? 'px-1.5 py-0.5 text-[7px] mb-2'
              : 'px-3 py-1 text-[10px] mb-4'
          }`}
        >
          {item.pain}
        </div>

        <p
          className={`text-gray-300 leading-relaxed ${
            compact ? 'text-[10px] line-clamp-3' : 'text-sm'
          }`}
        >
          "{item.text}"
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </div>
  );

  return (
    <section className="relative pb-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {!isMobile ? (
          <>
            <div className="absolute inset-0 opacity-15">
              <div
                className="absolute top-20 right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                style={{ animationDuration: '8s' }}
              />
              <div
                className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                style={{ animationDuration: '10s', animationDelay: '2s' }}
              />
              <div
                className="absolute top-1/2 left-1/2 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                style={{ animationDuration: '9s', animationDelay: '4s' }}
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
            <div className="absolute top-40 left-32 w-4 h-4 border-2 border-purple-500/30 rotate-45 opacity-30" />
            <div className="absolute bottom-40 right-32 w-3 h-3 bg-pink-500/40 rounded-full animate-pulse" />
            <div
              className="absolute top-20 right-40 w-5 h-5 border-2 border-red-500/30 rounded-full animate-pulse"
              style={{ animationDuration: '4s' }}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-pink-900/10" />
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-900/50 border border-purple-500/20 mb-8 backdrop-blur-md">
            <Users className="w-4 h-4 text-purple-500 animate-pulse" />
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase">
              Community Voices
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="text-white">VOICES OF THE </span>
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              VOID
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            Real degens, real scars, real redemption.
            <br className="hidden md:block" />
            <span className="text-white font-medium">
              We are all in this together.
            </span>
          </p>
        </div>

        {/* Testimonials */}
        {isCarousel ? (
          <div className="mb-24 relative px-2">
            <div className="relative">
              <div
                className="overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className="w-full flex-shrink-0 grid grid-cols-2 grid-rows-2 gap-3"
                    >
                      {getSlideItems(slideIndex).map((item, i) => (
                        <TestimonialCard key={i} item={item} compact />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/70 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 active:scale-95 transition-all duration-300 shadow-lg shadow-black/50 backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/70 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 active:scale-95 transition-all duration-300 shadow-lg shadow-black/50 backdrop-blur-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeSlide
                      ? 'w-8 h-2 bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          // Desktop Grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {testimonials.map((item, index) => (
              <TestimonialCard key={index} item={item} />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mx-auto mt-24">
          <div className="relative bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            <div className="w-full relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group relative flex flex-col items-center text-center"
                  >
                    <div className="inline-flex p-4 rounded-2xl bg-black/40 border border-white/10 mb-4 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                      {stat.icon}
                    </div>
                    <div
                      className={`text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
