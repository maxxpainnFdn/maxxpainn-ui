import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Users, Shield, Sparkles, MessageCircle, ArrowRight, Castle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiQuery from '@/components/apiQuery/ApiQuery';
import utils from '@/lib/utils';
import PostSlider from '@/components/posts/PostSlider';



export default function SocialProof({ appStats }) {

  const [posts, setPosts] = useState([]);

  const statsMeta = {
    totalPosts: { suffix: "+", l: "Stories", icon: MessageCircle, col: "text-maxx-pink" },
    totalAccounts: { suffix: "+", l: "Degens United", icon: Users, col: "text-maxx-violet" },
    totalClans: { suffix: "+", l: "Communities Created", icon: Castle, col: "text-maxx-pink" },
    totalMints: { suffix: "+", l: "Degens Rewarded", icon: Sparkles, col: "text-maxx-violet" },
  }

  useEffect(() => {
    //console.log("posts===>", posts);
  }, [posts]);

  return (
    <section className="bg-maxx-bg2 relative">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 gap-6 items-end mb-12">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" />// PAIN FEED</div>
            <h2 className="font-sans font-black text-[clamp(2.6rem,6.5vw,5rem)] leading-[0.94] uppercase text-maxx-white">
              OUR SHARED<br /><span className="text-maxx-pink"> TRAUMA.</span>
            </h2>
          </div>
          <div>
            <p className="font-sans font-medium text-[clamp(0.96rem,1.8vw,1.08rem)] text-maxx-bright leading-[1.8] mb-4">
              The SocialFi layer where degens share verified loss stories and mint tokens from their pain. Every post is proof of hurt.
            </p>
            {appStats && (
              <div className="flex gap-2 flex-wrap">
                {[
                  { l: `${appStats?.totalPosts}+ STORIES`, p: true },
                  { l: `${appStats?.totalAccounts}+ DEGENS`, p: false },
                ].map(b => (
                  <span key={b.l} className={`font-mono text-[0.66rem] tracking-widest uppercase px-2.5 py-1 rounded border ${b.p ? 'border-maxx-violet/25 text-maxx-pink bg-maxx-pink/5' : 'border-maxx-violet/15 text-maxx-violet bg-maxx-violet/5'}`}>
                    {b.l}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <ApiQuery
          uri="/posts"
          onSuccess={(data) => setPosts(data.slice(0, 4))}
          showError={false}
        >
          <PostSlider posts={posts} />
        </ApiQuery>

        <div className="text-center mb-14 mt-8">
          <Link to="/posts" className="inline-flex items-center gap-2.5 font-sans font-semibold text-[0.94rem] text-maxx-mid no-underline px-7 py-3.5 border border-maxx-violet/15 rounded-lg bg-maxx-violet/5 transition-all hover:border-maxx-violet hover:text-maxx-white hover:bg-maxx-violet/10">
            <Users size={16} /> See all stories <ArrowRight size={16} />
          </Link>
        </div>

        {appStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-maxx-violet/15 rounded-sm overflow-hidden">
            {Object.keys(statsMeta).map((key, i) => {
              const m = statsMeta[key];
              const Icon = m.icon;
              const suffix = m?.suffix ?? "";
              const value = appStats?.[key] ?? 0;

              return (
                <div key={key} className={`p-6 text-center border-maxx-violet/15 ${i % 2 === 0 ? 'bg-maxx-violet/5' : 'bg-transparent'} sm:border-r ${i === 1 || i === 3 ? 'border-r-0' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''}`}>
                  <div className="flex justify-center mb-2.5"><Icon size={20} className={m.col} /></div>
                  <div className={`font-sans font-black text-[clamp(1.8rem,4vw,2.8rem)] leading-none mb-1.5 ${m.col}`}>
                    {utils.toShortNumber(value)}{suffix}
                  </div>
                  <div className="font-mono text-[0.7rem] tracking-widest uppercase text-maxx-mid">{m.l}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className="h-[52px] bg-[linear-gradient(to_bottom_right,#0f0810_49.5%,#120a10_50%)]" />
    </section>
  );
}
