import utils, { cn } from "@/lib/utils";
import { CommentData } from "@/types/CommentData";
import ImageAvatar from "../ImageAvatar";
import LikeBtn from "@/components/posts/LikeBtn";

export interface CommentRowProps {
  data: CommentData
}

export default function CommentCard({ data: comment }: CommentRowProps) {
  
  const isLast = true;
  const author = comment.account;
  const hasLiked = (comment.likes && comment.likes.length > 0);
  const likesCount = comment.likesCount;
  
  return (
    <div className="flex mx-3">
      {/* Thread gutter */}
      <div className="flex flex-col items-center flex-shrink-0 w-11">
        <a className="action-btn" href={`/profile/${author.username}`} target="_blank">
          <ImageAvatar
            className="h-[40px] w-[40px] mx-auto border-4 shadow-2xl"
            src={utils.getServerImage(author.photo, "profile/photo", "tiny")}
            alt=""
            seed={author.address}
            size={40}
          />
        </a>
        {!isLast && <div className="w-0.5 flex-1 min-h-3 mt-1 bg-white/[0.07] rounded-full" />}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 pb-4 pl-3 pt-0.5">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <a className="action-btn" href={`/profile/${author.username}`} target="_blank">
            <span className="font-semibold text-maxx-white text-[0.82rem] truncate">{author.username}</span>
          </a>
          <span className="text-maxx-dim text-[0.75rem]">{utils.getRelativeDate(comment.createdAt)}</span>
        </div>
        <p className="text-maxx-mid  mb-2.5 text-[0.9rem]">
          {comment.content}
        </p>
        <div className="flex items-center gap-0 -ml-2 -mt-2">
          <LikeBtn
            contentType="comment"
            contentId={comment.id}
            hasLiked={hasLiked}
            totalLikes={likesCount}
          />
        </div>
      </div>
    </div>
  );
}
