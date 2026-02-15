import React, { lazy, Suspense } from 'react';
import Navigation from '@/components/nav/Navigation';
import EnhancedHero from '@/components/EnhancedHero';

const EnhancedStorySection = lazy(() => import('@/components/EnhancedStorySection'));
const SocialProof = lazy(() => import('@/components/SocialProof'));
const Tokenomics = lazy(() => import('@/components/Tokenomics'));
const Community = lazy(() => import('@/components/Community'));
const Footer = lazy(() => import('@/components/Footer'));

const LazySection = ({ children }) => (
  <Suspense fallback={<div className="min-h-[50vh]" />}>
    {children}
  </Suspense>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      <main className="pt-20 pb-12">
        <EnhancedHero />
        <LazySection><EnhancedStorySection /></LazySection>
        <LazySection><SocialProof /></LazySection>
        <LazySection><Tokenomics /></LazySection>
        <LazySection><Community /></LazySection>
        <LazySection><Footer /></LazySection>
      </main>
    </div>
  );
};

export default Index;
