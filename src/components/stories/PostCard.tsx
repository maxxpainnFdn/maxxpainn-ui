import utils, { cn } from "@/lib/utils";
import { MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { useState } from "react";
import CommentRow from "./CommentCard";
import { Post } from "@/types/Post";
import ImageAvatar from "../ImageAvatar";
import LikeBtn from "./LikeBtn";
import BookmarkBtn from "./BookmarkBtn";
import CommentBox from "./CommentBox";
import { AccountData } from "@/types/AccountData";
import { Link, useNavigate } from "react-router-dom";
import CommentList from "./CommentList";
import SocialPostBody from "./SocialPostBody";



// ---------------------------------------------------------------------------
// PostCard
// ---------------------------------------------------------------------------
export interface PostCardProps {
  data: Post;
  currentUser?: AccountData;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, post: Post) => void;
  onBookmarkStateChange?: (isBookmarked: boolean, post: Post) => void;
  className?: string;
  bodyClassName?: string;
}

export default function PostCard({
    data: post,
    currentUser,
    onClick,
    onBookmarkStateChange,
    className = "",
    bodyClassName = "",
  }: PostCardProps
) {
  
  
  const [commentsCount, setCommentsCount] = useState(post.commentsCount)
  
  //console.log("commentsCount===>", commentsCount)

  //console.log("currentUser===>", currentUser)
  const navigate = useNavigate()
  const [commentOpen, setCommentOpen] = useState(false);
  const isR = post.type.toLowerCase() === "pain_story";

  const author = post.account;
  const hasLiked = (post.likes && post.likes.length > 0);
  const hasBookmarked = (post.bookmarks && post.bookmarks.length > 0);

  const clan = post.clan;
  
  const isPostPage = /\/+(posts)\/+[0-9]+/.test(location.pathname);

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.target || !(e.target as HTMLElement).closest('.action-btn')) {
      onClick?.(e, post);
    }
  };

  const toggleComment = (e: React.MouseEvent) => {
    e.stopPropagation(); //openPostOnCommentBtnClick && 
    if (!isPostPage) {
      navigate(`/posts/${post.id}`)
    } else {
      setCommentOpen((v) => !v);
    }
  };
  
  //console.log("post===>", post)
  
  return (
    <div className={`_sp-fu group my-1 cursor-pointer ${isPostPage ? 'mb-10' : ''}`} onClick={handleOnClick}>
      {/* POST CARD */}
      <div
        className={cn(
          "relative overflow-hidden bg-maxx-bg2/90 border border-maxx-violet/[0.14] transition-[border-color,box-shadow] duration-300",
          "group-hover:shadow-[0_8px_40px_rgba(139,92,246,0.08)]",
          "px-5 pt-[18px] pb-4 rounded-[18px]",
          className
        )}
      >
        {/* Top shimmer */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isR
            ? "bg-gradient-to-r from-transparent via-maxx-pink to-transparent"
            : "bg-gradient-to-r from-transparent via-maxx-violet to-transparent"
        )} />

        {/* Author row */}
        <div className="flex items-center gap-3 mb-3">
          <a className="action-btn" href={`/profile/${author.username}`} target="_blank">
            <ImageAvatar
              className="h-[40px] w-[40px] mx-auto border-4 shadow-2xl"
              src={utils.getServerImage(author.photo, "profile/photo", "tiny")}
              alt=""
              seed={author.address}
              size={40}
            />
          </a>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <a className="action-btn" href={`/profile/${author.username}`} target="_blank">
                <span className="font-semibold text-maxx-white text-[0.85rem] truncate">{author.username}</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              {clan && (
                <Link className="text-maxx-sub font-semibold tracking-wide text-[0.75rem] truncate"
                  to={`/posts/clan/${clan.slug}-${clan.id}`}>
                  c/{clan.slug}
                </Link>
              )}
            </div>
          </div>
          
          {/*<button className="text-maxx-dim hover:text-maxx-sub transition-colors p-1 flex-shrink-0 -mt-0.5 bg-transparent border-none cursor-pointer">
            <MoreHorizontal size={15} />
          </button>*/}
          <span className="text-maxx-dim text-[0.78rem]">{utils.getRelativeDate(post.createdAt)}</span>

        </div>

        {/* Content */}
        <div className={cn("text-maxx-mid my-5 text-[0.9375rem]", bodyClassName)}>
          <SocialPostBody text={post.content} canCollapse={!isPostPage} />
        </div>

        {/* Divider */}
        <div className="mb-3 h-px bg-white/[0.06]" />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LikeBtn
              contentType="post"
              contentId={post.id}
              hasLiked={hasLiked}
              totalLikes={post.likesCount}
            />

            {/* Comment toggle — fills in when active */}
            <button
              onClick={toggleComment}
              className={cn(
                "action-btn inline-flex items-center gap-1.5 font-mono font-bold rounded-lg px-3 py-2 transition-all bg-transparent border-none cursor-pointer",
                commentOpen
                  ? "text-maxx-violet bg-maxx-violet/10"
                  : "text-maxx-sub hover:text-maxx-violet hover:bg-maxx-violet/5"
              )}
            >
              <MessageCircle size={16} />
              {commentsCount > 0 && (
                <span className="text-[0.78rem]">{commentsCount}</span>
              )}
            </button>

            <button className="action-btn inline-flex items-center gap-1.5 font-mono font-bold rounded-lg px-3 py-2 transition-all text-maxx-sub hover:text-maxx-mid hover:bg-maxx-violet/5 bg-transparent border-none cursor-pointer">
              <Share2 size={15} />
            </button>
          </div>

          <BookmarkBtn
            postId={post.id}
            isBookmarked={hasBookmarked}
            onChange={(state: boolean) => {
              onBookmarkStateChange?.(state, post)
            }}
          />
        </div>
        
        { (isPostPage && (commentsCount > 0 || currentUser)) && (
          <div className="my-3 h-px bg-white/[0.06]" />
        )}
        
        {isPostPage && currentUser && (
          <CommentBox
            postId={post.id}
            currentUser={currentUser}
            onComment={() => {
              setCommentsCount(prev => (prev+1))
            }}
          />
        )}
        
        {(commentsCount > 0 && isPostPage) && (
          <CommentList
            postId={post.id}
            totalComments={commentsCount}
          />
        )}
        
        {isPostPage && commentsCount >= 3 && currentUser && (
          <>
            <div className="my-3 h-px bg-white/[0.06]" />
            <CommentBox
              postId={post.id}
              currentUser={currentUser}
            />
          </>
        )}
      </div> 
    </div>
  );
}
