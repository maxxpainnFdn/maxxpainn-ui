import React, { lazy, Suspense } from 'react';
import Navigation from '@/components/nav/Navigation';
import Hero from '@/components/pages/index/Hero';

const StorySection = lazy(() => import('@/components/pages/index/StorySection'));
const SocialProof = lazy(() => import('@/components/pages/index/SocialProof'));
const Tokenomics = lazy(() => import('@/components/pages/index/Tokenomics'));
const Community = lazy(() => import('@/components/pages/index/Community'));
const Footer = lazy(() => import('@/components/Footer'));

const LazySection = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="min-h-[50vh] bg-maxx-bg0" />}>
    {children}
  </Suspense>
);

const Index = () => (
  <div className="min-h-screen bg-maxx-bg0 overflow-x-hidden relative">
    {/* Global noise layer via Tailwind utility */}
    <div className="fixed inset-0 pointer-events-none z-0 bg-noise-pattern opacity-100" />
    
    <Navigation />
    <main className="relative z-10">
      <Hero />
      <LazySection><StorySection /></LazySection>
      <LazySection><SocialProof /></LazySection>
      <LazySection><Tokenomics /></LazySection>
      <LazySection><Community /></LazySection>
      <LazySection><Footer /></LazySection>
    </main>
  </div>
);

export default Index;
