import React, { useState } from 'react';
import { Users, Shield, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PainPostCard from '@/components/PainPostCard';

const painPosts = [
  {
    author: "DegenApe", handle: "@wagmi_420", init: "DA", time: "2h",
    badge: "LUNA SURVIVOR", badgeCol: "#8b5cf6", verified: true,
    avatarGrad: "linear-gradient(135deg, #818cf8, #8b5cf6)",
    text: "Lost 80% of my savings in Luna. $47K — gone in 72 hours. Watched my portfolio go from life-changing to zero while Do Kwon tweeted memes.\n\nMAXXPAINN gets the anger. We don't cope — we convert.",
    loss: "$47,000", lossLabel: "LUNA COLLAPSE", likes: "2.4K", comments: "318", reposts: "891", views: "48K",
    liked: true, 
  },
  {
    author: "CryptoSurvivor", handle: "@rekt_again", init: "CS", time: "5h",
    badge: "SERIAL RUG VICTIM", badgeCol: "#ff2d78", verified: false,
    avatarGrad: "linear-gradient(135deg, #ff2d78, #c0003c)",
    text: "Rugged 6 times this year. Believed the 'audited contract' narrative every time.\n\nThis free mint feels different. Community taking power back. No investment. Just pain as proof.",
    loss: "$12,300", lossLabel: "SERIAL RUGS", likes: "1.8K", comments: "244", reposts: "567", views: "31K",
    liked: false,
  }
];


export default function SocialProof() {
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
            <div className="flex gap-2 flex-wrap">
              {[{l: "47K+ STORIES", p: true}, {l: "89K+ DEGENS", p: false}, {l: "$3.2B LOSSES", p: true}].map(b => (
                <span key={b.l} className={`font-mono text-[0.66rem] tracking-widest uppercase px-2.5 py-1 rounded border ${b.p ? 'border-maxx-violet/25 text-maxx-pink bg-maxx-pink/5' : 'border-maxx-violet/15 text-maxx-violet bg-maxx-violet/5'}`}>
                  {b.l}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          {painPosts.map((post, i) => <PainPostCard key={i} post={post} />)}
        </div>

        <div className="text-center mb-14">
          <Link to="/feed" className="inline-flex items-center gap-2.5 font-sans font-semibold text-[0.94rem] text-maxx-mid no-underline px-7 py-3.5 border border-maxx-violet/15 rounded-lg bg-maxx-violet/5 transition-all hover:border-maxx-violet hover:text-maxx-white hover:bg-maxx-violet/10">
            <Users size={16} /> See all pain stories <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 border border-maxx-violet/15 rounded-sm overflow-hidden">
          {[
            { l: "Stories", v: "47K+", icon: MessageCircle, col: "text-maxx-pink" },
            { l: "Degens United", v: "89K+", icon: Users, col: "text-maxx-violet" },
            { l: "Total Losses", v: "$3.2B+", icon: Shield, col: "text-maxx-pink" },
            { l: "Already Minted", v: "12.8K", icon: Sparkles, col: "text-maxx-violet" },
          ].map((s, i) => (
            <div key={i} className={`p-6 text-center border-maxx-violet/15 ${i % 2 === 0 ? 'bg-maxx-violet/5' : 'bg-transparent'} sm:border-r ${i === 1 || i === 3 ? 'border-r-0' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''}`}>
              <div className="flex justify-center mb-2.5"><s.icon size={20} className={s.col} /></div>
              <div className={`font-sans font-black text-[clamp(1.8rem,4vw,2.8rem)] leading-none mb-1.5 ${s.col}`}>{s.v}</div>
              <div className="font-mono text-[0.7rem] tracking-widest uppercase text-maxx-mid">{s.l}</div>
            </div>
          ))}
        </div> 
      </div>
      <div className="h-[52px] bg-[linear-gradient(to_bottom_right,#0f0810_49.5%,#120a10_50%)]" />
    </section>
  );
}
