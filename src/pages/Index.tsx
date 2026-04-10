import React, { lazy, Suspense, useEffect, useState } from 'react';
import Navigation from '@/components/nav/Navigation';
import Hero from '@/components/pages/index/Hero';
import { useApi } from '@/hooks/useApi';

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

let _appStatsCache;

const Index = () => {
  
  const api = useApi()
  const [appStats, setAppStats] = useState(null)
  

  useEffect(() => {
    if (!appStats && _appStatsCache) {
      setAppStats(_appStatsCache)
    }
    api.get('/app-stats').then((res) => {
      setAppStats(res.data)
      _appStatsCache = res.data
    })
  }, [])

  
  useEffect(() => {
    
    setTimeout(() => {
      
      const hash = window.location.hash;
      if (!hash) return;
    
      const id = hash.slice(1);

      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth" });
      });
    }, 500);
    
  }, []);
  
  return (
    <div className="min-h-screen bg-maxx-bg0 overflow-x-hidden relative">
      {/* Global noise layer via Tailwind utility */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-noise-pattern opacity-100" />
      <Navigation />
      <main className="relative z-10">
        <Hero appStats={appStats} />
        <LazySection><StorySection /></LazySection>
        <LazySection><SocialProof appStats={appStats} /></LazySection>
        <LazySection><Tokenomics /></LazySection>
        <LazySection><Community /></LazySection>
        <LazySection><Footer /></LazySection>
      </main>
    </div>
  )
}

export default Index;
