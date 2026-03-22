import utils, { cn } from "@/lib/utils";
import { Bookmark, Coins, Heart, MessageCircle, MoreHorizontal, Repeat2, Share2, TrendingDown } from "lucide-react";
import { useState } from "react";
import CommentRow from "./CommentRow";
import { Post } from "@/types/Post";
import ImageAvatar from "../ImageAvatar";
import LikeBtn from "./LikeBtn";

export interface PostCardProps {
  data: Post;
}

export default function PostCard({ data: post }: PostCardProps) {
  
  const onLike = () => {}
  const onRepost = () => {}
  const onBookmark = () => { }
  
  console.log("post===>", post)
    
  const isR = post.type.toLowerCase() === "pain_story";
  const hasComments = false;
  const PREVIEW_COUNT = 2;
  const visibleComments = []//post.commentList.slice(0, PREVIEW_COUNT);
  const hiddenCount = 0;//post.commentList.length - PREVIEW_COUNT;
  
  const author = post.account;
  const hasLiked = false;
  const hasReposted = false
  
  const clan = post.clan;
  

  return (
    <div className="_sp-fu group">
      {/* POST CARD */}
      <div
        className={cn(
          "relative overflow-hidden bg-maxx-bg2/90 border border-maxx-violet/[0.14] transition-[border-color,box-shadow] duration-300",
          " group-hover:shadow-[0_8px_40px_rgba(139,92,246,0.08)]",
          hasComments ? "rounded-t-[18px]  border-b-[0]" : "rounded-[18px]",
          "px-5 pt-[18px] pb-4"
        )}
      >
        {/* Top shimmer — appears on hover */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isR
            ? "bg-gradient-to-r from-transparent via-maxx-pink to-transparent"
            : "bg-gradient-to-r from-transparent via-maxx-violet to-transparent"
        )} />


        {/* Author row */}
        <div className="flex items-center gap-3 mb-3">
          <ImageAvatar
            className=" h-[40px] w-[40px] mx-auto border-4 shadow-2xl" 
            src={utils.getServerImage(author.photo, "profile/photo", "tiny")}
            alt=""
            seed={author.address}
            size={40}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-semibold text-maxx-white text-[0.95rem] truncate">{author.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-maxx-dim text-[0.78rem]">{utils.getRelativeDate(post.createdAt)}</span>
            </div>
          </div>
          <button className="text-maxx-dim hover:text-maxx-sub transition-colors p-1 flex-shrink-0 -mt-0.5 bg-transparent border-none cursor-pointer">
            <MoreHorizontal size={15} />
          </button>
        </div>
        

        {/* Content */}
        <p className="text-maxx-mid leading-[1.8] font-light mb-4 text-[0.9375rem] pl-[52px]">
          {post.content}
          
          <div className="flex my-2">
            <div>
              {clan && (
                <a href={`/clans/${clan.slug}-${clan.id}`}
                  className="flex items-center gap-1 font-mono rounded-md pe-1.5 py-0.5 no-underline bg-maxx-violet/10 text-maxx-violet-lt text-[0.68rem] tracking-[0.04em] uppercase hover:bg-maxx-violet/[0.15] transition-colors">
                  <span className="text-[0.8rem]">
                    <ImageAvatar
                      src={utils.getServerImage(clan.image, "clans", "tiny")}
                      fallbackText={clan.name}
                      className="w-[24px] h-[24px] object-cover text-sm font-bold rounded"
                      fallbackTextClass="bg-maxx-bg/50 text-maxx-white rounded-none"
                    />
                  </span>
                  <span className="ps-0.5">{post.clan.name}</span>
                </a>
              )}
            </div>
          </div>
        </p>

        {/* Divider */}
        <div className="mb-3 h-px bg-white/[0.06]" />

        {/* Actions */}
        <div className="flex items-center justify-between pl-[50px]">
          <div className="flex items-center">
            
            <LikeBtn
              likeType="post"
              hasLiked={hasLiked}
              totalLikes={post.likesCount}
            />

            <a href={`/stories/${post.id}`}
              className="inline-flex items-center gap-1.5 font-mono font-bold rounded-lg px-3 py-2 no-underline transition-all text-maxx-sub hover:text-maxx-violet hover:bg-maxx-violet/5">
              <MessageCircle size={16} /> {post.commentsCount > 0 && <span className="text-maxx-sub text-[0.78rem]">{post.commentsCount}</span> }
            </a>

            <button
              onClick={() => {}}
              className={cn("inline-flex items-center gap-1.5 font-mono font-bold rounded-lg px-3 py-2 transition-all bg-transparent border-none cursor-pointer",
                hasReposted ? "text-maxx-emerald" : "text-maxx-sub hover:text-maxx-emerald hover:bg-maxx-emerald/5"
              )}
            >
              <Repeat2 size={16} /> {post.repostsCount > 0 && <span className="text-maxx-sub text-[0.78rem]">{post.repostsCount}</span> }
            </button>

            <button className="inline-flex items-center gap-1.5 font-mono font-bold rounded-lg px-3 py-2 transition-all text-maxx-sub hover:text-maxx-mid hover:bg-maxx-violet/5 bg-transparent border-none cursor-pointer">
              <Share2 size={15} />
            </button>
          </div>

          <button
            onClick={() => {}}
            className={cn("inline-flex items-center gap-1.5 font-mono font-bold rounded-lg px-3 py-2 transition-all bg-transparent border-none cursor-pointer",
              post.bookmarked ? "text-maxx-violet" : "text-maxx-sub hover:text-maxx-violet hover:bg-maxx-violet/5"
            )}
          >
            <Bookmark size={15} fill={post.bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* COMMENT THREAD */}
      {hasComments && (
        <div className="bg-maxx-bg0/85 border border-maxx-violet/[0.14] border-t-0 rounded-b-[18px] px-5 pt-1 pb-2">
          <div className="flex items-center gap-3 pt-3 mb-3 border-t border-white/[0.05]">
            <span className="font-mono text-maxx-dim uppercase tracking-widest text-[0.65rem]">
              {post.comments} {post.comments === 1 ? "reply" : "replies"}
            </span>
          </div>

          {visibleComments.map((c: any, i: number) => (
            <CommentRow
              key={c.id}
              comment={c}
              isLast={i === visibleComments.length - 1 && hiddenCount === 0}
              postId={post.id}
              onLike={()=>{}}
            />
          ))}

          {hiddenCount > 0 && (
            <a
              href={`/stories/${post.id}`}
              className="flex items-center gap-2.5 font-mono no-underline rounded-xl px-3 py-2.5 mb-2 transition-all text-maxx-violet hover:text-maxx-violet-lt hover:bg-maxx-violet/[0.06] text-[0.78rem]"
            >
              <div className="flex -space-x-1.5">
                {post.commentList.slice(PREVIEW_COUNT).slice(0, 3).map((c: any) => (
                  <Av key={c.id} initials={c.avatar} color={c.color} size={20} round />
                ))}
              </div>
              Show {hiddenCount} more {hiddenCount === 1 ? "reply" : "replies"} →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
