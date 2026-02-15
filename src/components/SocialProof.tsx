import React from 'react';
import { MessageCircle, Users, TrendingUp, ShieldAlert, Quote } from 'lucide-react';

const SocialProof = () => {
  const testimonials = [
    {
      text: "I lost 80% in the Luna crash. I was ready to quit crypto forever. MAXXPAINN is the first project that actually understands the anger.",
      author: "DegenApe",
      handle: "@wagmi_420",
      pain: "LUNA SURVIVOR",
      avatar: "DA"
    },
    {
      text: "Been rugged 6 times this year alone. It's exhausting. This free mint feels like the community taking power back.",
      author: "CryptoSurvivor",
      handle: "@rekt_again",
      pain: "SERIAL RUG VICTIM",
      avatar: "CS"
    },
    {
      text: "FTX took my life savings. This art speaks to my soul. We turn pain into power. LFG! 🔥",
      author: "SolanaMaxi",
      handle: "@ftx_refund_wen",
      pain: "FTX CREDITOR",
      avatar: "SM"
    },
    {
      text: "From -$50k to believing again. The roadmap is solid, but the message is what sold me. We are legion.",
      author: "DiamondHands",
      handle: "@hodl_forever",
      pain: "LIQUIDATION KING",
      avatar: "DH"
    },
    {
      text: "Finally, a project that doesn't promise 'utility' but delivers straight facts. The art is sick.",
      author: "NFT_Collector",
      handle: "@jpeg_enjoyer",
      pain: "GAS WAR VETERAN",
      avatar: "NC"
    },
    {
      text: "Join the discord, the vibes are different here. No moonboi spam, just real people who survived the bear market.",
      author: "BearMarketBuilder",
      handle: "@build_or_die",
      pain: "COMMUNITY OG",
      avatar: "BB"
    }
  ];

  const stats = [
    { 
      label: "Pain Stories Shared", 
      value: "47K+", 
      icon: <MessageCircle className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    { 
      label: "Degens United", 
      value: "89K+", 
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      label: "Collective Losses", 
      value: "\$3.2B+", 
      icon: <ShieldAlert className="w-6 h-6" />,
      color: "from-red-500 to-orange-500"
    },
    { 
      label: "Already Minted", 
      value: "12.8K", 
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500"
    },
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      
      {/* --- BACKGROUND LAYERS (Enhanced Design) --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '4s' }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
        
        {/* Floating shapes */}
        <div className="absolute top-40 left-32 w-4 h-4 border-2 border-purple-500/30 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-40 right-32 w-3 h-3 bg-pink-500/40 rounded-full animate-pulse" />
        <div className="absolute top-20 right-40 w-5 h-5 border-2 border-red-500/30 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* --- SECTION HEADER --- */}
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
            <span className="text-white font-medium">We are all in this together.</span>
          </p>
        </div>

        {/* --- TESTIMONIAL GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {testimonials.map((item, index) => (
            <div 
              key={index}
              className="group relative bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:bg-gray-900/60 transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/30 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)] overflow-hidden"
            >
              {/* Internal gradient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Quote Icon Background */}
              <div className="absolute top-6 right-6 text-white/5 group-hover:text-white/10 transition-colors">
                <Quote size={48} />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Header: Author Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-white/20 flex items-center justify-center text-sm font-black text-white shadow-lg">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{item.author}</div>
                    <div className="text-xs text-gray-500">{item.handle}</div>
                  </div>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-950/30 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                  {item.pain}
                </div>

                {/* Text */}
                <p className="text-gray-300 leading-relaxed text-sm">
                  "{item.text}"
                </p>
              </div>

              {/* Hover shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          ))}
        </div>

        {/* --- STATS DASHBOARD --- */}
       <div className="mx-auto">
          <div className="relative bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden group">
            
            {/* Internal glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            {/* Content */}
            <div className="w-full relative z-10">

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="group relative flex flex-col items-center text-center"
                  >
                    {/* Icon */}
                    <div className="inline-flex p-4 rounded-2xl bg-black/40 border border-white/10 mb-4 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                      {stat.icon}
                    </div>

                    {/* Value */}
                    <div className={`text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                      {stat.value}
                    </div>

                    {/* Label */}
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
