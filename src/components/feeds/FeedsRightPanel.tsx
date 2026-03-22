import { BarChart2, ChevronRight, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const TRENDING_TAGS = [
  { tag: "LunaCollapse",  count: "14.2k", hot: true  },
  { tag: "FTXVictims",    count: "11.8k", hot: true  },
  { tag: "RugPullAlert",  count: "8.3k",  hot: false },
  { tag: "Liquidated",    count: "6.1k",  hot: false },
  { tag: "BridgeExploit", count: "4.2k",  hot: false },
];

const CLANS = [
  { id: "luna-fallen",   name: "Luna Fallen",   emoji: "🌙", members: 4821,  posts: 1204 },
  { id: "ftx-creditors", name: "FTX Creditors", emoji: "💔", members: 11203, posts: 3891 },
  { id: "rug-survivors", name: "Rug Survivors", emoji: "🪦", members: 7654,  posts: 2110 },
  { id: "liq-gang",      name: "Liq Gang",      emoji: "⚡", members: 3390,  posts: 987  },
];

export default function FeedsRightPanel() {
  return (
    <div className="hidden xl:flex flex-col gap-3 flex-shrink-0 w-[268px] sticky top-[116px]">

      {/* Trending */}
      <div className="rounded-2xl overflow-hidden bg-maxx-bg2/88">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={13} className="text-maxx-violet" />
            <span className="font-mono font-bold text-maxx-bright uppercase tracking-wider text-[0.72rem]">Trending Trauma</span>
          </div>
          <div className="flex flex-col gap-1">
            {TRENDING_TAGS.map((t, i) => (
              <a key={t.tag} href={`/stories?tag=${t.tag}`}
                className="flex items-center justify-between py-2 px-2 no-underline rounded-lg transition-colors hover:bg-maxx-violet/[0.06] group/tag">
                <div>
                  <div className="font-mono text-maxx-dim mb-0.5 text-[0.68rem] tracking-[0.08em]">#{i + 1}</div>
                  <div className="font-semibold text-maxx-bright group-hover/tag:text-maxx-white transition-colors text-[0.85rem]">#{t.tag}</div>
                  <div className="text-maxx-sub mt-0.5 text-[0.72rem]">{t.count} stories</div>
                </div>
                {t.hot && (
                  <span className="font-mono font-bold rounded-md px-2 py-0.5 text-red-400 bg-red-500/10 text-[0.62rem] tracking-[0.06em] uppercase">Hot</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Active Clans */}
      <div className="rounded-2xl overflow-hidden bg-maxx-bg2/88">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={13} className="text-maxx-violet" />
            <span className="font-mono font-bold text-maxx-bright uppercase tracking-wider text-[0.72rem]">Active Clans</span>
          </div>
          <div className="flex flex-col gap-1">
            {CLANS.map(c => (
              <a key={c.id} href={`/clans/${c.id}`}
                className="flex items-center justify-between py-2 px-2 no-underline rounded-lg transition-colors hover:bg-maxx-violet/[0.06] group/clan">
                <div className="flex items-center gap-2.5">
                  <span className="text-[1.1rem]">{c.emoji}</span>
                  <div>
                    <div className="font-semibold text-maxx-bright group-hover/clan:text-maxx-white transition-colors text-[0.85rem]">{c.name}</div>
                    <div className="text-maxx-sub text-[0.72rem]">{c.members.toLocaleString()} members</div>
                  </div>
                </div>
                <ChevronRight size={13} className="text-maxx-dim group-hover/clan:text-maxx-violet transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mint CTA */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-maxx-pink/[0.06]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-maxx-pink to-maxx-violet" />
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(255,45,120,0.2),transparent 70%)" }} />
        <Zap size={16} className="text-maxx-pink mb-2" fill="currentColor" />
        <h4 className="font-black text-maxx-white mb-1.5 uppercase font-mono text-[0.95rem] tracking-[0.04em]">Earn From Your Pain</h4>
        <p className="text-maxx-sub mb-3.5 leading-relaxed text-[0.82rem]">Post a rewarded story and mint $PAINN tokens.</p>
        <Link to="/mint" className="no-underline">
          <button className="btn-p w-full justify-center py-2.5"><Zap size={12} /> Mint Your Story</button>
        </Link>
      </div>
    </div>
  );
}
