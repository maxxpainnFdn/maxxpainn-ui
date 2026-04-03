import { CommentData } from "@/types/CommentData"
import CommentCard from "./CommentCard"
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";

export interface CommentsSummaryProps {
  postId: number;
  commentsList: CommentData[]
}

export default function CommentListShort({ commentsList, postId }) {
  return (
    <div className="mt-5 overflow-hidden">
      <div className="mb-5 h-px bg-white/[0.06]" />
      {commentsList.map((c: any, i: number) => (
        <CommentCard
          key={c.id}
          data={c}
        />
      ))}
      <Link
        to={`/posts/${postId}`}
        className="flex items-center justify-between gap-2.5 font-mono no-underline rounded-xl px-3 py-2.5 mb-2 transition-all text-maxx-violet hover:text-maxx-violet-lt hover:bg-maxx-violet/[0.06] text-[0.78rem]"
      >
        <div>Show more</div>
        <ChevronRight size={14} />
      </Link>
    </div>
  )
}
