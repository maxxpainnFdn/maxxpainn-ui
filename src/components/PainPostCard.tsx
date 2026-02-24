import { BadgeCheck, BarChart2, Heart, MessageCircle, MoreHorizontal, Repeat, Repeat2, Share, Share2 } from "lucide-react";
import { useState } from "react";

export default function PainPostCard({ post }) {
  
  const [liked, setLiked] = useState(post.liked);
  
  return (
    <article className="bg-[#120a10]/90 border border-maxx-violet/15 rounded-xl overflow-hidden relative group card-hover">
      <div className="h-0.5 opacity-60 w-full absolute top-0" style={{ background: post.avatarGrad }} />
      <div className="p-4 pt-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center font-sans font-black text-[0.95rem] text-white border-2 border-white/10 shrink-0" style={{ background: post.avatarGrad }}>
              {post.init}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-bold text-[0.94rem] text-maxx-white">{post.author}</span>
                {post.verified && <BadgeCheck size={14} className="text-maxx-violet fill-maxx-violet text-white" />}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[0.68rem] text-maxx-sub">
                <span>{post.handle}</span><span className="text-[0.6rem] text-maxx-dim">·</span><span>{post.time}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[0.62rem] tracking-widest uppercase px-2 py-[3px] rounded-sm border bg-opacity-10" style={{ color: post.badgeCol, borderColor: `${post.badgeCol}40`, backgroundColor: `${post.badgeCol}12` }}>
              {post.badge}
            </span>
            <MoreHorizontal size={16} className="text-maxx-sub cursor-pointer" />
          </div>
        </div>

        <div className="mb-3.5">
          <p className={`font-sans text-[0.925rem] leading-[1.75] text-maxx-bright`}>
            {post.text}
          </p>
        </div>

      </div>

      <div className="border-t border-maxx-violet/10 px-4 py-2 flex items-center justify-between">
        <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1.5 p-1.5 rounded-md transition-colors ${liked ? 'text-maxx-pink' : 'text-maxx-sub hover:bg-maxx-pink/10 hover:text-maxx-pink'}`}>
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
          <span className="font-mono text-[0.68rem] font-medium">{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 p-1.5 rounded-md text-maxx-sub hover:bg-maxx-violet/10 hover:text-maxx-violet transition-colors">
          <MessageCircle size={16} /><span className="font-mono text-[0.68rem] font-medium">{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 p-1.5 rounded-md text-maxx-sub hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
          <Repeat size={16} /><span className="font-mono text-[0.68rem] font-medium">{post.reposts}</span>
        </button>
        <button className="flex items-center gap-1.5 p-1.5 rounded-md text-maxx-sub hover:bg-maxx-violet/10 hover:text-maxx-violet transition-colors">
          <BarChart2 size={16} /><span className="font-mono text-[0.68rem] font-medium">{post.views}</span>
        </button>
        <button className="p-1.5 rounded-md text-maxx-sub hover:bg-maxx-pink/10 hover:text-maxx-pink transition-colors">
          <Share size={16} />
        </button>
      </div>
    </article>
  );
}
