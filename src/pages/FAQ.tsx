import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Zap, ChevronDown, Flame, Skull, Target, Settings, Blocks, Users, Book, BookA } from 'lucide-react';
import Footer from '@/components/Footer';
import Navigation from '@/components/nav/Navigation';
import { SiMedium, SiTelegram, SiX } from '@icons-pack/react-simple-icons';
import { Helmet } from 'react-helmet-async';

const FAQ = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const faqs = [
    {
      category: "technical",
      question: "What is MAXXPAINN?",
      answer: `MAXXPAINN is a free-to-mint token protocol built on the Solana blockchain, 
      inspired by the viral mechanics of XEN Network. It allows anyone to mint tokens 100% free, 
      promoting fair distribution and organic community growth.`,
      intensity: "high"
    },
    {
      category: "eligibility", 
      question: "What qualifies me as a 'degen' for the free mint?",
      answer: "If you have a Solana wallet, you're in. No whitelist, no gatekeeping — just pure degen energy. Anyone with a wallet qualifies to mint for free on the protocol.",
      intensity: "extreme"
    },
    {
      category: "minting",
      question: "How do I claim my free MAXXPAINN Tokens?",
      answer: `First, initiate the mint process. After that, 
                you'll need to wait for the selected wait period to expire before you can 
                withdraw your MAXXPAINN tokens. 🔥 Patience is pain; but pain is gain.`,
      intensity: "high"
    },
    {
      category: "technical",
      question: "What blockchain is MAXXPAINN on?",
      answer: `MAXXPAINN is currently deployed exclusively on the Solana blockchain, 
              taking full advantage of its speed, low fees, and degen-friendly ecosystem.`,
      intensity: "medium"
    },
    {
      category: "utility",
      question: "What utility does my MAXXPAINN tokens have?",
      answer: `MAXXPAINN currently has no utility — it's a pure degen experiment. 
                There are no promises, no guarantees — just vibes, speculation, and pain.`,
      intensity: "high"
    },
    {
      category: "supply",
      question: "How many MAXXPAINN tokens will exist?",
      answer: `The total supply of MAXXPAINN is not fixed. 
        However, as more tokens are minted, the cost to mint increases due to our on-chain algorithm that factors in rising computational and storage costs. 
        Over time, minting becomes more painful — and more expensive.`,
      intensity: "medium"
    },
    {
      category: "roadmap",
      question: "What's the long-term vision for MAXXPAINN?",
      answer: `MAXXPAINN is more than just a token — it's the foundation of a full-blown degen 
        ecosystem. We're building toward DAO governance, DeFi integrations, and 
        cross-chain expansion. This isn't a meme, it's a movement. Pain today. Power tomorrow. LFG! 🌙`,
      intensity: "extreme"
    },
    {
      category: "legal",
      question: "Is this financial advice?",
      answer: `Absolutely not. We're not financial advisors — we're just battle-tested degens embracing the chaos. 
               Always DYOR, know the risks, and remember: NFA. ⚠️`,
      intensity: "high"
    },
    {
      category: "community",
      question: "How can I get involved in the community?",
      answer: "Join our Telegram, follow our X, share your pain story, and help other degens navigate the crypto wasteland. We're stronger together. Apes together strong! 🦍",
      intensity: "medium"
    },
    {
      category: "security",
      question: "How do I know this isn't another rug pull or scam?",
      answer: `Fair question — we've all felt the pain. But MAXXPAINN is a 100% fair, 
        free mint with no pre-mine, no team allocation, and everything happens on-chain. 
        What's there to rug when you're minting for free?
        Still, stay safe: always use a fresh wallet for minting and claiming. Trust, but verify. 🛡️`,
      intensity: "extreme"
    }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'legal': return <AlertTriangle className="w-4 h-4 text-pink-400" />;
      case 'security': return <Shield className="w-4 h-4 text-green-400" />;
      case 'utility': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'minting': return <Target className="w-4 h-4 text-purple-400" />;
      case 'eligibility': return <Skull className="w-4 h-4 text-pink-600" />;
      case 'roadmap': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'technical': return <Settings className="w-4 h-4 text-blue-400" />;
      case 'supply': return <Blocks className="w-4 h-4 text-green-400" />;
      case 'community': return <Users className="w-4 h-4 text-cyan-400" />;
      default: return null;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'minting': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      case 'eligibility': return 'text-pink-600 border-pink-600/30 bg-pink-600/10';
      case 'technical': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'utility': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'supply': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'roadmap': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'legal': return 'text-pink-400 border-pink-400/30 bg-pink-400/10';
      case 'community': return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
      case 'security': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const getIntensityGlow = (intensity) => {
    switch (intensity) {
      case 'extreme': return 'shadow-[0_0_20px_rgba(219,39,119,0.4)] border-pink-600/50';
      case 'high': return 'shadow-[0_0_15px_rgba(168,85,247,0.4)] border-purple-500/50';
      case 'medium': return 'shadow-[0_0_10px_rgba(59,130,246,0.3)] border-blue-500/40';
      default: return 'shadow-[0_0_5px_rgba(107,114,128,0.3)] border-gray-500/40';
    }
  };
  
  const title = "MaxxPainn FAQ – Frequently Asked Questions";
  const description = "Find answers to common questions about minting, clans, token claims, and how MaxxPainn works.";


  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
  
        {/* OpenGraph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://maxxpainn.com/faq" />
        <meta property="og:image" content="https://maxxpainn.com/images/pages/faq.jpg" />
  
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://maxxpainn.com/images/pages/faq.jpg" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
        
        <Navigation />
        
        <section className="pt-32 pb-20 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
  
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-4 mb-6">
                <Skull className="w-10 h-10 text-pink-400 animate-pulse" />
                <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black">
                  <span className="text-white">
                    Frequently Asked
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Questions</span>
                </h1>
                <Flame className="w-10 h-10 text-orange-400 animate-pulse" />
              </div>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Got questions? We've got answers. No fluff, just straight facts about the MAXXPAINN movement.
                <span className="text-purple-400 font-bold block mt-2">LFG! 🚀</span>
              </p>
            </div>
  
            {/* FAQ Items */}
            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className={`bg-gray-900/80 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01] ${
                    hoveredItem === index 
                      ? `${getIntensityGlow(faq.intensity)} transform translate-y-[-2px]` 
                      : 'border-purple-500/30 shadow-xl'
                  }`}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <AccordionTrigger className="text-left hover:no-underline group">
                    <div className="flex items-center gap-4 w-full">
                      <div className={`p-3 rounded-xl transition-all duration-300 ${
                        hoveredItem === index ? 'bg-purple-500/20 scale-110 shadow-lg' : 'bg-gray-800/60'
                      }`}>
                        {getCategoryIcon(faq.category)}
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className={`mb-3 ${getCategoryColor(faq.category)} transition-all duration-300 ${
                          hoveredItem === index ? 'scale-105 shadow-lg' : ''
                        }`}>
                          {faq.category.toUpperCase()}
                        </Badge>
                        <div className="text-white font-bold text-lg text-left group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                          {faq.question}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 mt-6 pb-2">
                    <div className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 rounded-xl p-6 border-l-4 border-purple-500/50">
                      <p className="text-lg leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
  
            {/* Disclaimer Section */}
            <div className="mt-20">
              <div className="bg-gradient-to-r from-pink-950/40 via-pink-900/30 to-pink-950/40 border-2 border-pink-600/40 rounded-2xl p-8 mb-8 relative overflow-hidden shadow-[0_0_30px_rgba(219,39,119,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent animate-pulse"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <AlertTriangle className="w-7 h-7 text-pink-400 animate-pulse" />
                    <h3 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
                      ⚠️ DEGEN DISCLAIMER ⚠️
                    </h3>
                    <Skull className="w-7 h-7 text-pink-400 animate-pulse" />
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                    MAXXPAINN is an experimental project created by degens, for degens. This is <span className="text-pink-400 font-bold">NOT</span> financial advice. 
                    Cryptocurrency investments carry <span className="text-pink-400 font-bold">HIGH RISK</span> and can result in <span className="text-pink-400 font-bold">TOTAL LOSS</span>. Only participate with funds 
                    you can afford to lose completely. We are not responsible for any financial losses. 
                    <span className="text-purple-400 font-bold"> DYOR and make informed decisions. NFA! 🚨</span>
                  </p>
                </div>
              </div>
  
              {/* Community Section */}
              <div className="text-center">
                <p className="text-gray-300 mb-6 text-xl">
                  Still have questions? Hit us up in our community channels. 
                  <span className="text-purple-400 font-bold block mt-2">We're here for you, fren! 🤝</span>
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30 bg-purple-400/10 hover:bg-purple-400/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-110 cursor-pointer px-6 py-3 text-base font-semibold shadow-lg hover:shadow-purple-500/30">
                    <SiTelegram className="w-6 h-6 me-2" /> Telegram
                  </Badge>
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30 bg-blue-400/10 hover:bg-blue-400/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-110 cursor-pointer px-6 py-3 text-base font-semibold shadow-lg hover:shadow-blue-500/30">
                    <SiX className="w-4 h-4 me-2" /> X / Twitter
                  </Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-300 hover:scale-110 cursor-pointer px-6 py-3 text-base font-semibold shadow-lg hover:shadow-green-500/30">
                    <BookA className="w-4 h-4 me-2" /> Blog Posts
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default FAQ;
