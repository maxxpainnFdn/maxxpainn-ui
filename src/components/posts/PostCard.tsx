import { useState } from "react";
import PostMintChips from "./PostMintChips";
import { BadgeCheck, Bookmark, Heart, MessageSquare, MoreHorizontal, Repeat2, Share2, Shield } from "lucide-react";

const fmtDay = d => d >= 365 ? `${(d / 365).toFixed(1)}y` : d >= 30 ? `${Math.round(d / 30)}mo` : `${d}d`;
const fmtN   = n => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

/* ── Avatar ── */
const Avatar = ({ initials, verified, clan }) => (
  <div className="relative flex-shrink-0">
    <div className={`w-10 h-10  bg-grad-btn flex items-center justify-center font-mono font-black text-sm text-maxx-white rounded-full`}>
      {initials}
    </div>
    {verified && (
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-maxx-bg1 border border-maxx-pink rounded-full flex items-center justify-center">
        <BadgeCheck className="w-2.5 h-2.5 text-maxx-pink" />
      </div>
    )}
  </div>
);

/* ── Clan badge ── */
const ClanBadge = ({ clan }) => (
  <span className={`inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase px-2.5 py-1 rounded-full border font-bold ${clan.tw.text} ${clan.tw.border} ${clan.tw.bg}`}>
    <Shield className="w-3 h-3" />
    {clan.name}
  </span>
);



/* ── Action button ── */
const ActBtn = ({ icon: Icon, count, active, activeCls, onClick, filled }) => {
  const [pop, setPop] = useState(false);
  const go = () => { setPop(true); setTimeout(() => setPop(false), 220); onClick(); };
  return (
    <button
      onClick={go}
      className={`flex items-center gap-1.5 font-mono text-xs transition-all duration-150
        ${active ? activeCls : "text-maxx-sub hover:text-maxx-bright"}
        ${pop ? "scale-125" : "hover:scale-110"}`}
    >
      <Icon
        className="w-3.5 h-3.5"
        fill={filled && active ? "currentColor" : "none"}
        strokeWidth={filled && active ? 0 : 1.8}
      />
      {count !== undefined && <span>{fmtN(count)}</span>}
    </button>
  );
};


export default function PostCard({ post, onLike, onRepost, onBookmark }) {
  
  const [expanded, setExpanded] = useState(false);
  const paras = post.text.split("\n").filter(Boolean);
  const isLong = paras.length > 3 || post.text.length > 280;

  return (
    <article className="group relative bg-maxx-bg1/80 border border-maxx-violet/15 rounded-lg overflow-hidden hover:border-maxx-violet/35 transition-all duration-300">
      {/* top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 flex gap-3">

        {/* avatar col */}
        <div className="flex flex-col items-center flex-shrink-0">
          <Avatar initials={post.author.initials} verified={post.author.verified} />
          <div className="flex-1 w-px bg-maxx-violet/15 mt-3 min-h-[16px]" />
        </div>

        {/* content */}
        <div className="flex-1 min-w-0">

          {/* author row */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mb-2.5">
            <span className="font-sans font-bold text-base text-maxx-white">
              @{post.author.handle}
            </span>
            <span className="pill">Rank #{post.author.rank.toLocaleString()}</span>
            <span className="text-maxx-sub text-sm">·</span>
            <span className="font-mono text-xs text-maxx-sub">{post.ts}</span>
            <div className="ml-auto">
              <button className="text-maxx-sub/50 hover:text-maxx-mid transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* clan */}
          <div className="mb-3">
            <ClanBadge clan={post.clan} />
          </div>

          {/* body text */}
          <div className="text-sm text-maxx-bright leading-relaxed font-sans mb-3">
            {(expanded ? paras : paras.slice(0, 3)).map((p, i) => (
              <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
            ))}
            {isLong && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="font-mono text-xs text-maxx-violet hover:text-maxx-violetLt mt-2 block transition-colors"
              >
                {expanded ? "Show less" : "Show more →"}
              </button>
            )}
          </div>

          {/* mint chips */}
          {post.mint && (
            <div className="mb-4">
              <PostMintChips amount={post.mint.amount} waitDays={post.mint.waitDays} />
            </div>
          )}

          {/* actions */}
          <div className="flex items-center justify-between pt-3 border-t border-maxx-violet/10">
            <div className="flex items-center gap-5">
              <ActBtn icon={MessageSquare} count={post.stats.comments}
                active={false} activeCls="" onClick={() => {}} />
              <ActBtn icon={Repeat2}
                count={post.stats.reposts + (post.reposted ? 1 : 0)}
                active={post.reposted} activeCls="text-emerald-400"
                onClick={() => onRepost(post.id)}
              />
              <ActBtn icon={Heart}
                count={post.stats.likes + (post.liked ? 1 : 0)}
                active={post.liked} activeCls="text-maxx-pink"
                filled onClick={() => onLike(post.id)} />
            </div>
            <div className="flex items-center gap-4">
              <ActBtn icon={Bookmark}
                count={post.stats.bookmarks}
                active={post.bookmarked} activeCls="text-maxx-violet"
                filled onClick={() => onBookmark(post.id)} />
              <button className="text-maxx-sub/60 hover:text-maxx-bright transition-colors">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
