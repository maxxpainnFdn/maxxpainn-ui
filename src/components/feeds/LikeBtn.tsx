import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";

type LikeType = "post" | "comment"

export interface LikeBtn {
  likeType: LikeType;
  hasLiked: boolean;
  totalLikes: number;
}

export default function LikeBtn({ likeType, hasLiked, totalLikes }: LikeBtn) {
 
  const [heartAnim, setHeartAnim] = useState(false);

  return (
    <button
      onClick={()=>{}}
      className={cn("inline-flex items-center gap-1.5 font-mono font-bold rounded-lg px-3 py-2 transition-all bg-transparent border-none cursor-pointer",
        hasLiked ? "text-maxx-pink" : "text-maxx-sub hover:text-maxx-pink hover:bg-maxx-pink/5"
      )}
    >
      <Heart size={16} fill={hasLiked ? "currentColor" : "none"}
        style={{ animation: heartAnim ? "_sp-hp .32s cubic-bezier(.34,1.56,.64,1)" : "none", transition: "fill .15s" }}
      />  {totalLikes > 0 && <span className="text-maxx-sub text-[0.78rem]">{totalLikes}</span> }
    </button>
  )
}
