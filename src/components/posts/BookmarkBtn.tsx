import toast from "@/hooks/toast";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import {  useState } from "react";
import Spinner from "../spinner/Spinner";


export interface BookmarkBtnProps {
  postId: number;
  isBookmarked: boolean;
}

export default function BookmarkBtn({
  postId,
  isBookmarked
}: BookmarkBtnProps) {
  
  const api = useApi()
  
  const [hasBookmarked, setHasBookmarked] = useState<boolean>(isBookmarked)
  const [isLoading, setLoading] = useState<boolean>(false)
  
  const toggleLike = async (e) => {
    e.preventDefault()
    
    if (isLoading) return;
    
    const action = !hasBookmarked;
        
    const uri = `/posts/${postId}/bookmark`
    
    setLoading(true)
    
    const resultStatus = await api.postWithAuth(uri, { action: ((action) ? "bookmark" : "unbookmark") })
    
    setLoading(false)
    
    if (resultStatus.isError()) {
      toast.error(resultStatus.getMessage())
      setHasBookmarked(prev => !prev)
      return;
    }
        
    setHasBookmarked(action)
  }
  
  return (
    <button
      onClick={toggleLike}
      className={cn("action-btn inline-flex items-center gap-1.5 font-mono font-bold rounded-lg px-3 py-2 transition-all bg-transparent border-none cursor-pointer",
        hasBookmarked ? "text-maxx-violet" : "text-maxx-sub hover:text-maxx-violet hover:bg-maxx-violet/5"
      )}
      disabled={isLoading}
    >
      { isLoading
        ? <Spinner size={16} /> 
        : <><Bookmark size={15} fill={hasBookmarked ? "currentColor" : "none"} /></>
      }
    </button>
  )
}
