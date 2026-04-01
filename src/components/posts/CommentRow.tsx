import utils, { cn } from "@/lib/utils";
import { Heart, MessageCircle } from "lucide-react";

export interface CommentRowProps {
  comment: any;
  isLast: boolean;
  postId: string;
  onLike: (id: string) => void
}

function Av({ initials, color, size = 40, round = false }: { initials: string; color: string; size?: number; round?: boolean }) {
  return (
    <div
      className={cn("flex-shrink-0 flex items-center justify-center font-mono font-bold tracking-[0.03em]", round ? "rounded-full" : "rounded-lg")}
      style={{
        width: size, height: size,
        background: `${color}1a`,
        border: `1.5px solid ${color}50`,
        fontSize: size * 0.3,
        color,
      }}
    >
      {initials}
    </div>
  );
}

export default function CommentRow({ comment, isLast, postId, onLike }: CommentRowProps) {
  return (
    <div className="flex">
      {/* Thread gutter */}
      <div className="flex flex-col items-center flex-shrink-0 w-11">
        <Av initials={comment.avatar} color={comment.color} size={32} round />
        {!isLast && <div className="w-0.5 flex-1 min-h-3 mt-1 bg-white/[0.07] rounded-full" />}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 pb-4 pl-3 pt-0.5">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="font-semibold text-maxx-bright text-[0.88rem]">{comment.handle}</span>
          <span className="text-maxx-dim text-[0.75rem]">{comment.ts}</span>
        </div>
        <p className="text-maxx-mid font-light leading-relaxed mb-2.5 text-[0.9rem] leading-[1.65]">
          {comment.text}
        </p>
        <div className="flex items-center gap-0 -ml-2">
          <button
            onClick={() => onLike(comment.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-all bg-transparent border-none cursor-pointer font-medium text-[0.75rem] hover:bg-white/[0.04]",
              comment.liked ? "text-maxx-pink" : "text-maxx-sub"
            )}
          >
            <Heart size={13} fill={comment.liked ? "currentColor" : "none"} />
            {comment.likes > 0 ? utils.toShortNumber(comment.likes) : "Like"}
          </button>
          <a
            href={`/stories/${postId}`}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 no-underline transition-all text-maxx-sub hover:text-maxx-mid hover:bg-white/[0.04] font-medium text-[0.75rem]"
          >
            <MessageCircle size={13} /> Reply
          </a>
        </div>
      </div>
    </div>
  );
}
