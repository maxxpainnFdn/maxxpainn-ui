
import React from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import { Shield, Zap, Flame, TrendingUp, Users, Target, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const title = "The MaxxPainn Manifesto – Pain to Power";
  const description =
    "From the depths of crypto pain emerges unstoppable power. Join the degens’ revolution and turn losses into strength with MaxxPainn.";

const Manifesto = () => {
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
    
          {/* OpenGraph */}
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://maxxpainn.com/manifesto" />
          <meta property="og:image" content="https://maxxpainn.com/images/pages/manifesto.jpg" />
    
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content="https://maxxpainn.com/images/pages/manifesto.jpg" />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
          <Navigation />
          
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
              <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            </div>
    
            <main className="relative pt-32 pb-12">
              <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-20">
                  
                  <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6">
                    <span className="text-white">
                      THE
                    </span>{' '}
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 bg-clip-text text-transparent">MANIFESTO</span>
                  </h1>
                  
                  <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    From the depths of crypto pain emerges unstoppable power
                  </p>
    
                  {/* Decorative divider */}
                  <div className="flex items-center justify-center gap-4 mt-12">
                    <div className="h-18 w-18 md:h-24 md:w-24 bg-gradient-to-r from-transparent to-purple-500"></div>
                    <Flame className="w-8 h-8 text-pink-600" />
                    <div className="h-18 w-18 md:h-24 md:w-24 bg-gradient-to-l from-transparent to-purple-500"></div>
                  </div>
                </div>
    
                {/* Content Grid */}
                <div className="space-y-16">
                  {/* Section 1 - The Genesis */}
                  <section className="relative">
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:border-purple-500/40 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          The Genesis of Pain
                        </h2>
                      </div>
                      
                      <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                        <p className="text-xl">
                          We are the battle-scarred veterans of a thousand crypto winters. We've watched fortunes 
                          evaporate in milliseconds, seen dreams shatter on red candles, and felt the crushing 
                          weight of FOMO decisions. But from this pain, we rise stronger.
                        </p>
                        <p className="text-xl border-l-4 border-pink-600 pl-6 py-2 bg-pink-900/10">
                          MAXXPAINN isn't just a token—it's a declaration. A middle finger to the market makers, 
                          the whales, and the suits who think they own this space. We are the degens, and this 
                          is our time.
                        </p>
                      </div>
                    </div>
                  </section>
    
                  {/* Section 2 - Our Creed */}
                  <section>
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 md:p-12 shadow-2xl">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-orange-600 flex items-center justify-center shadow-lg">
                          <Flame className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                          Our Creed
                        </h2>
                      </div>
    
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          { icon: Shield, text: "We embrace the pain because it makes us unbreakable", color: "from-purple-600 to-purple-700" },
                          { icon: TrendingUp, text: "We turn losses into lessons, tears into determination", color: "from-blue-600 to-blue-700" },
                          { icon: Zap, text: "We hodl when others fold, buy when others cry", color: "from-yellow-600 to-yellow-700" },
                          { icon: Crown, text: "We are the storm that others fear to weather", color: "from-pink-600 to-pink-700" }
                        ].map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <div key={idx} className="group bg-gray-800/60 border-2 border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/50 hover:transform hover:translate-x-2 transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-lg text-gray-200 leading-relaxed pt-2">
                                  {item.text}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
    
                  {/* Section 3 - The Revolution */}
                  <section>
                    <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-purple-500/30 rounded-3xl p-8 md:p-12 shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                            <Target className="w-8 h-8 text-white" />
                          </div>
                          <h2 className="text-2xl md:text-4xl font-bold text-white">
                            The Revolution
                          </h2>
                        </div>
                        
                        <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
                          <p className="text-xl">
                            This isn't about getting rich quick. This is about proving that the degens, the 
                            risk-takers, the ones who dare to dream big in a world that tells us to play it 
                            safe—we are the future of finance.
                          </p>
                          <p className="text-xl font-semibold text-purple-300">
                            Every transaction is a vote of confidence. Every hold is an act of rebellion. 
                            Every pump is proof that pain transforms into power when wielded by the right hands.
                          </p>
                        </div>
    
                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mt-10">
                          {[
                            { label: "Transactions", value: "Votes" },
                            { label: "Holds", value: "Rebellion" },
                            { label: "Pumps", value: "Power" }
                          ].map((stat, idx) => (
                            <div key={idx} className="text-center p-6 bg-black/30 rounded-2xl border border-purple-500/20">
                              <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                              <div className="text-2xl font-bold text-purple-400">{stat.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
    
                  {/* Section 4 - The Promise */}
                  <section>
                    <div className="relative overflow-hidden bg-gray-900/80 backdrop-blur-sm border-2 border-purple-500/30 rounded-3xl p-8 md:p-12 shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8 justify-center">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 md:w-8 md:h-8  text-white" />
                          </div>
                          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            The Promise
                          </h2>
                        </div>
                        
                        <div className="max-w-4xl mx-auto">
                          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500/40 p-10 rounded-2xl backdrop-blur-sm">
                            <blockquote className="text-xl sm:text-2xl md:text-3xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-pink-300 leading-relaxed">
                              "We swear by the code, by the blockchain, by the unstoppable force of 
                              decentralization—MAXXPAINN will be the token that turns your deepest 
                              crypto wounds into your greatest victories."
                            </blockquote>
                            <div className="flex justify-center mt-8">
                              <div className="flex items-center gap-2">
                                <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-transparent rounded"></div>
                                <Flame className="w-6 h-6 text-pink-600" />
                                <div className="h-1 w-12 bg-gradient-to-l from-purple-500 to-transparent rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
    
                  {/* Call to Action */}
                  <section className="text-center py-12">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-3xl opacity-30"></div>
                      <div className="relative">
                        <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-pink-600 bg-clip-text text-transparent">
                          JOIN THE REVOLUTION
                        </h2>
                      </div>
                    </div>
                    
                    <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                      The time for playing it safe is over. The degens shall inherit the blockchain.
                    </p>
    
                    {/* Power Flow */}
                    <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold max-w-2xl mx-auto ">
                      <Flame className="w-5 h-5 sm:w-8 sm:h-8 text-pink-600" />
                      <div className="flex items-center gap-3 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        <span>Pain</span> 
                        <span>→</span> 
                        <span>Power</span> 
                        <span>→</span> 
                        <span>Profit</span>
                      </div>
                    </div>
    
                    {/* CTA Button */}
                    <div className="mt-12 flex justify-center w-full">
                      <Link to="/mint">
                        <button className="px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-pink-600 hover:from-purple-700 hover:via-pink-700 hover:to-pink-700 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_50px_rgba(168,85,247,0.5)]">
                          Start Your Journey
                        </button>
                      </Link>
                    </div>
                  </section>
    
                  {/* Bottom Quote */}
                  <section className="text-center py-8">
                    <div className="max-w-3xl mx-auto p-8 bg-gray-900/60 border border-purple-500/20 rounded-2xl backdrop-blur-sm">
                      <p className="text-xl text-gray-400 italic">
                        "Every great fortune was built on great pain. Your time is now."
                      </p>
                      <div className="mt-4 flex justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        <div className="w-2 h-2 rounded-full bg-pink-600"></div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </main>
          </div>
          
          <Footer />
        </div>
    </>
  );
};

export default Manifesto;
