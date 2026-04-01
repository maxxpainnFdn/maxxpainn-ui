import toast from "@/hooks/toast";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";

type LikeType = "post" | "comment"

export interface LikeBtn {
  contentId: number;
  contentType: LikeType;
  hasLiked: boolean;
  totalLikes: number;
}

export default function LikeBtn({
  contentType,
  contentId,
  hasLiked,
  totalLikes=0
}: LikeBtn) {
  
  const api = useApi()
  
  const [liked, setLiked] = useState<boolean>(hasLiked)
  const [likesCount, setLikesCount] = useState<number>(totalLikes || 0)
  const [isLoading, setLoading] = useState<boolean>(false)
  
  const toggleLike = async (e) => {
    e.preventDefault()
    
    if (isLoading) return;
    
    const action = !liked;
        
    const uri = (contentType == "post")
      ? `/posts/${contentId}/like`
      : `/comments/${contentId}/like`
    
    setLoading(true)
    
    const resultStatus = await api.postWithAuth(uri, { action: ((action) ? "like" : "unlike") })
    
    setLoading(false)
    
    if (resultStatus.isError()) {
      toast.error(resultStatus.getMessage())
      setLiked(prev => !prev)
      return;
    }
    
    setLiked(action)
    setLikesCount(action ? likesCount + 1 : likesCount - 1)
    
  }
  
  return (
    <button
      onClick={toggleLike}
      className={cn("action-btn inline-flex items-center gap-1.5 font-mono font-bold rounded-lg px-3 py-2 transition-all bg-transparent border-none cursor-pointer",
        liked ? "text-maxx-pink" : "text-maxx-sub hover:text-maxx-pink hover:bg-maxx-pink/5"
      )}
      disabled={isLoading}
    >
      {isLoading
        ? <Spinner size={16} /> 
        : <>
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
          {likesCount > 0 && <span className="text-maxx-sub text-[0.78rem]">{" "}{likesCount}</span>}
        </>
      }
      
    </button>
  )
}
