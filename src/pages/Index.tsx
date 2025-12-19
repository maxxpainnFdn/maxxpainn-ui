
import React from 'react';
import Navigation from '@/components/nav/Navigation';
import EnhancedHero from '@/components/EnhancedHero';
import EnhancedStorySection from '@/components/EnhancedStorySection';
import SocialProof from '@/components/SocialProof';
import Tokenomics from '@/components/Tokenomics';
import Community from '@/components/Community';
import Footer from '@/components/Footer';

const Index = () => {
  
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      <main className="pt-20 pb-12">
        <EnhancedHero />
        <EnhancedStorySection />
        <SocialProof />
        <Tokenomics />
        <Community />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
