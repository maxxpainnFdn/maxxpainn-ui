import React, { useEffect, useState } from 'react';
import { Users, Sparkles, MessageCircle, ArrowRight, Castle } from 'lucide-react';
import { Link } from 'react-router-dom';
import utils from '@/lib/utils';
import PostSlider from '@/components/stories/PostSlider';
import ApiQueryV2 from '@/components/apiQuery/ApiQueryV2';

export default function SocialProof({ appStats }) {
  const [posts, setPosts] = useState([]);

  const statsMeta = {
    totalPosts:     { suffix: "+", l: "Stories",              icon: MessageCircle, col: "text-maxx-pink" },
    totalAccounts:  { suffix: "+", l: "Degens United",        icon: Users,         col: "text-maxx-violet" },
    totalClans:     { suffix: "+", l: "Communities Created",  icon: Castle,        col: "text-maxx-pink" },
    totalMints:     { suffix: "+", l: "Degens Rewarded",      icon: Sparkles,      col: "text-maxx-violet" },
  };

  return (
    <section className="bg-maxx-bg2 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-end mb-8 sm:mb-12">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" />// STORIES</div>
            <h2 className="font-sans font-black text-[clamp(2rem,6.5vw,5rem)] leading-[0.94] uppercase text-maxx-white">
              OUR SHARED<br /><span className="text-maxx-pink"> STRUGGLES.</span>
            </h2>
          </div>
          <div>
            <p className="font-sans font-medium text-[clamp(0.88rem,1.8vw,1.08rem)] text-maxx-bright leading-[1.8] mb-4">
              A SocialFi layer where degens turn verified loss stories into token allocations. Every post is proof of experience.
            </p>
            {appStats && (
              <div className="flex gap-2 flex-wrap">
                {[
                  { l: `${appStats?.totalPosts}+ STORIES`,  p: true },
                  { l: `${appStats?.totalAccounts}+ DEGENS`, p: false },
                ].map(b => (
                  <span key={b.l} className={`font-mono text-[0.63rem] sm:text-[0.66rem] tracking-widest uppercase px-2.5 py-1 rounded border ${b.p ? 'border-maxx-violet/25 text-maxx-pink bg-maxx-pink/5' : 'border-maxx-violet/15 text-maxx-violet bg-maxx-violet/5'}`}>
                    {b.l}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Posts */}
        <ApiQueryV2
          uri="/posts"
          showError={false}
        >
          {(data) => {
            const posts = data.slice(0, 4);
            return (<PostSlider posts={posts} />)
          }}
        </ApiQueryV2>

        {/* See All */}
        <div className="text-center mb-10 sm:mb-14 mt-6 sm:mt-8">
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[0.88rem] sm:text-[0.94rem] text-maxx-mid no-underline px-5 sm:px-7 py-3 sm:py-3.5 border border-maxx-violet/15 rounded-lg bg-maxx-violet/5 transition-all hover:border-maxx-violet hover:text-maxx-white hover:bg-maxx-violet/10"
          >
            <Users size={15} /> See all stories <ArrowRight size={15} />
          </Link>
        </div>

        {/* Stats Grid */}
        {appStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-maxx-violet/15 rounded-sm overflow-hidden">
            {Object.keys(statsMeta).map((key, i) => {
              const m = statsMeta[key];
              const Icon = m.icon;
              const value = appStats?.[key] ?? 0;
              return (
                <div
                  key={key}
                  className={[
                    'p-4 sm:p-6 text-center border-maxx-violet/15',
                    i % 2 === 0 ? 'bg-maxx-violet/5' : 'bg-transparent',
                    'sm:border-r',
                    i === 1 || i === 3 ? 'sm:border-r-0' : '',
                    i < 2 ? 'border-b sm:border-b-0' : '',
                    i % 2 === 0 ? 'border-r' : '',
                  ].join(' ')}
                >
                  <div className="flex justify-center mb-2"><Icon size={18} className={m.col} /></div>
                  <div className={`font-sans font-black text-[clamp(1.4rem,4vw,2.8rem)] leading-none mb-1 sm:mb-1.5 ${m.col}`}>
                    {utils.toShortNumber(value)}{m.suffix}
                  </div>
                  <div className="font-mono text-[0.6rem] sm:text-[0.7rem] tracking-widest uppercase text-maxx-mid leading-tight">
                    {m.l}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
      <div className="h-[52px] bg-[linear-gradient(to_bottom_right,#0f0810_49.5%,#120a10_50%)]" />
    </section>
  );
}
