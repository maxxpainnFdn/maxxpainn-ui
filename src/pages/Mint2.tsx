
import React, { useState, useEffect } from 'react';
import { Zap, Lock, Clock, DollarSign, Star, TrendingUp, Calendar, Share2 } from 'lucide-react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PainMeter from '@/components/mint/PainMeter';
import TokenAnimation from '@/components/mint/TokenAnimation';
import PainStoryShowcase from '@/components/mint/PainStoryShowcase';
import PainBadges from '@/components/mint/PainBadges';
import StoryTemplates from '@/components/mint/StoryTemplates';
import mintConfig from "@/config/mint"
import { daysToYearsMonthsDays } from '@/lib/utils';

const Mint2 = () => {
  const [amount, setAmount] = useState('1');
  const [lockPeriod, setLockPeriod] = useState(mintConfig.defaultLockPeriod);
  const [painStory, setPainStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [savedDraft, setSavedDraft] = useState('');

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (painStory && painStory !== savedDraft) {
        setSavedDraft(painStory);
        console.log('Draft saved...');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [painStory, savedDraft]);

  const handleMint = async () => {
    setIsLoading(true);
    setIsMinting(true);
    
    // Simulate minting process with enhanced feedback
    setTimeout(() => {
      setIsLoading(false);
      setIsMinting(false);
      alert(`🔥 MINT SUCCESSFUL! 🔥\n\nYour ${calculateReward()} MAXXPAINN tokens are being forged from pure pain!\n\nWelcome to the legion of pain warriors! 💪`);
    }, 3000);
  };

  const calculateReward = () => {
    const baseReward = parseFloat(amount) || 0;
    const lockBonus = lockPeriod * 0.1; // 10% bonus per day
    return (baseReward * (1 + lockBonus)).toFixed(2);
  };

  const formatLockPeriod = (days: number) => {
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''}`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) !== 1 ? 's' : ''}`;
    if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) !== 1 ? 's' : ''}`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) !== 1 ? 's' : ''}`;
  };

  const getUnlockDate = () => {
    const today = new Date();
    const unlockDate = new Date(today.getTime() + lockPeriod * 24 * 60 * 60 * 1000);
    return unlockDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };



  const shareOnTwitter = () => {
    const text = `Just minted ${calculateReward()} MAXXPAINN tokens with a ${formatLockPeriod(lockPeriod)} lock! 🔥\n\nTransforming pain into power! 💪\n\n#MAXXPAINN #PainToPower`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-black mb-6">
              <span className="gradient-text">MINT</span>{' '}
              <span className="text-red-500">PAINN</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Endure pain. Gain strength. Claim your $painn rank.
            </p>
            
            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-900 border border-purple-500/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-400">1,247</div>
                <div className="text-xs text-gray-400">Pain Warriors</div>
              </div>
              <div className="bg-gray-900 border border-purple-500/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-400">89</div>
                <div className="text-xs text-gray-400">Active Mints</div>
              </div>
              <div className="bg-gray-900 border border-purple-500/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-400">456K</div>
                <div className="text-xs text-gray-400">Locked Tokens</div>
              </div>
              <div className="bg-gray-900 border border-purple-500/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">$47.2K</div>
                <div className="text-xs text-gray-400">Total Value</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Mint Form - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-900 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Claim your Rank</CardTitle>
                  <CardDescription className="text-gray-400">
                    Turn your pain into unstoppable force
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Term: {(lockPeriod)} Days
                    </label>
                    <input
                      type="range"
                      min={mintConfig.minLockDays}
                      max={mintConfig.maxLockDays}
                      defaultValue={mintConfig.defaultLockPeriod}
                      onChange={(e) => setLockPeriod(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1 day</span>
                      <span>
                        {mintConfig.maxLockDays} Days
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="text-purple-400 h-4 w-4" />
                      <span className="text-sm text-gray-400">
                        Unlocks on: <span className="text-purple-400 font-semibold">{getUnlockDate()}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Your Pain Story (Optional)
                      </label>
                    </div>
                    
                    {/*showTemplates && (
                      <div className="mb-4">
                        <StoryTemplates onSelectTemplate={handleTemplateSelect} />
                      </div>
                    )*/}
                    
                    <textarea
                      value={painStory}
                      onChange={(e) => setPainStory(e.target.value)}
                      className="w-full bg-black border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none resize-none"
                      rows={4}
                      placeholder="Share your crypto pain story... How did you get here? What drove you to this moment?"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Share your journey and inspire others in the community</span>
                      {savedDraft && <span className="text-green-400">Draft saved ✓</span>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={handleMint}
                      disabled={isLoading || !amount}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg  disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'FORGING PAIN...' : 'Claim Rank'}
                    </Button>
                    
                    <Button
                      onClick={shareOnTwitter}
                      variant="outline"
                      className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Your Power
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Token Animation 
              <TokenAnimation isActive={isMinting} amount={calculateReward()} />
              */}
            </div>

            {/* Right Column - Stats & Enhancements */}
            <div className="space-y-6">
              {/* Enhanced Mint Preview */}
              <Card className="bg-gray-900 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-400">Mint Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-bold">{amount} $PAINN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lock Period:</span>
                    <span className="text-white font-bold">{formatLockPeriod(lockPeriod)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lock Bonus:</span>
                    <span className="text-green-400 font-bold">+{(lockPeriod * 10).toFixed(0)}%</span>
                  </div>
                  <div className="border-t border-purple-500/20 pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-300">Total Reward:</span>
                      <span className="text-purple-400 font-bold">{calculateReward()} $PAINN</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pain Meter */}
              <PainMeter lockPeriod={lockPeriod} amount={amount} />

              {/* Pain Badges  */}
              <PainBadges lockPeriod={lockPeriod} amount={amount} />
               

              {/* Lock Benefits
              <Card className="bg-gray-900 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-400">Lock Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Lock className="text-green-400" size={20} />
                    <span className="text-gray-300">Higher rewards for longer locks</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="text-blue-400" size={20} />
                    <span className="text-gray-300">Compound interest on locked tokens</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="text-yellow-400" size={20} />
                    <span className="text-gray-300">Exclusive community perks</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="text-purple-400" size={20} />
                    <span className="text-gray-300">Early access to new features</span>
                  </div>
                </CardContent>
              </Card>
              */}

              {/* Warning */}
              <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                <p className="text-red-300 text-sm">
                  <strong>⚠️ Remember:</strong> Locked tokens cannot be withdrawn until the lock period expires. 
                  Choose your lock period wisely - pain requires commitment.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-400 mb-4">
              "Every great fortune was built on great pain. Your time is now."
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Mint2;
