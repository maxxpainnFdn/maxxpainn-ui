import React, { lazy, Suspense } from 'react';
import Navigation from '@/components/nav/Navigation';
import EnhancedHero from '@/components/EnhancedHero';
import { Helmet } from 'react-helmet-async';

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

const title ="MaxxPainn - A Free-to-Mint SPL Token on Solana"

const Index = () => {

  return (
    <>
      <Helmet>
        <title>{ title }</title>
        <meta
          name="description"
          content="Inspired by XEN Network but built for Solana. MaxxPainn rewards those brave enough to endure time-locked staking."
        />
        <meta property="og:title" content={ title } />
        <meta
          property="og:description"
          content={ title }
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <Navigation />
        <main className="pt-16 sm:pt-20 pb-8 sm:pb-12">
          <EnhancedHero />
          <LazySection><EnhancedStorySection /></LazySection>
          <LazySection><SocialProof /></LazySection>
          <LazySection><Tokenomics /></LazySection>
          <LazySection><Community /></LazySection>
          <LazySection><Footer /></LazySection>
        </main>
      </div>
    </>
  );
};

export default Index;
