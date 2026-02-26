/**
 * MAXXPAINN — Clans Page
 *
 * Design system: maxx-* tokens, eyebrow / pill / btn-p / btn-s / card-hover classes.
 * No raw Tailwind color names. No hex codes in JSX.
 */

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Castle, Search, Shield, Users, Gem, TrendingUp, Zap, ArrowRight, Plus } from 'lucide-react';
import ClanStats from '@/components/clans/ClanStats';
import ClanCard from '@/components/clans/ClanCard';
import ApiQuery from '@/components/apiQuery/ApiQuery';
import CreateClan from '@/components/clans/CreateClan';
import ClansSorter from '@/components/clans/ClansSorter';
import ClansSearch from '@/components/clans/ClansSearch';
import Button from '@/components/button/Button';

const Clans = () => {
  const [clans, setClans]               = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy]             = useState('newest');
  const [queryKey, setQueryKey]         = useState(0);

  useEffect(() => {
    setQueryKey(Date.now());
  }, [sortBy, searchKeyword]);

  const title       = "MaxxPainn Clans — Build your community & earn up to $1 per mint";
  const description = "Join a MaxxPainn Clan and show your allegiance during minting. Clans earn up to $1 for every mint when selected by members. Build your community. Earn together.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://maxxpainn.com/clans" />
        <meta property="og:image"       content="https://maxxpainn.com/images/pages/clans.jpg" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content="https://maxxpainn.com/images/pages/clans.jpg" />
      </Helmet>

      <div className="min-h-screen bg-maxx-mainBg">
        <Navigation />

        <div className="relative overflow-hidden">
          {/* ambient glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-maxx-violet rounded-full blur-[160px] opacity-[0.07]" />
            <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] bg-maxx-pink rounded-full blur-[140px] opacity-[0.05]" />
          </div>

          <main className="relative pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

              {/* ── PAGE HEADER ── */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                  <div className="eyebrow mb-3">
                    <span className="eyebrow-dot" />
                    Community · Earn Together
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-3">
                    <span className="bg-grad-accent bg-clip-text text-transparent">CLANS</span>
                  </h1>
                  <p className="text-base text-maxx-mid max-w-md leading-relaxed">
                    Build your community, grow your empire and earn SOL every time a member mints.
                  </p>
                </div>

                <CreateClan />
              </div>

              {/* ── CLAN STATS ── */}
              <ClanStats />

              {/* ── FILTER BAR ── */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-8 mt-8">
                <div className='max-w-[100%] sm:max-w-[300px]'>
                  <ClansSearch onChange={v => setSearchKeyword(v)} />
                </div>
                
                <ClansSorter onChange={value => setSortBy(value)} />
              </div>

              {/* ── CLAN GRID ── */}
              <ApiQuery
                uri="/clans"
                onSuccess={setClans}
                query={{ sortBy, search: searchKeyword }}
                key={queryKey}
              >
                {clans.length === 0 ? (
                  <div className="text-center py-24 bg-maxx-bg1/40 border border-maxx-violet/15 rounded-lg">
                    <div className="relative inline-block mb-5">
                      <Castle className="w-14 h-14 text-maxx-sub mx-auto" />
                      <div className="absolute inset-0 bg-maxx-violet blur-2xl opacity-20 pointer-events-none" />
                    </div>
                    <h3 className="text-xl font-black text-maxx-white mb-2 tracking-tight">No clans found</h3>
                    <p className="text-sm text-maxx-sub mb-6">Try adjusting your search or be the first to create one.</p>
                    <CreateClan />
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-2">
                    {clans.map(clan => (
                      <div key={clan.id} className="flex-shrink-0 basis-[240px]">
                        <ClanCard clan={clan} />
                      </div>
                    ))}
                  </div>
                )}
              </ApiQuery>

            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Clans;
