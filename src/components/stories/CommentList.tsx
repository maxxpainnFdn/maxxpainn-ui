import utils from "@/lib/utils";
import InfiniteScroll, { InfiniteScrollRef } from "../infiniteScroll/InfiniteScroll";
import CommentCard from "./CommentCard";
import CommentsSorter from "./CommentsSorter";
import { useEffect, useRef, useState } from "react";
import EventBus from "@/core/EventBus";

export default function CommentList({ postId, totalComments }) {
  
  const [sort, setSort] = useState("newest");
  
  const scrollRef = useRef<InfiniteScrollRef>(null);
  
  
  useEffect(() => {
    
    EventBus.on(`onComment_${postId}`, (commentData) => {
      scrollRef.current.addData(commentData)
    })
    
    return () => EventBus.off(`onComment_${postId}`)
  },[])

  return (
    <div className="">
      <div className="flex justify-between my-5">
        <div className="font-semibold text-[0.8rem]">{utils.toShortNumber(totalComments)} Comments</div>
        <CommentsSorter 
          onChange={ (s:string) => { setSort(s)} }
        />
      </div>
      <InfiniteScroll
        uri={`/posts/${postId}/comments`}
        query={{ sort }}
        key={`${postId}_${sort}`}
        className="mt-5"
        renderer={CommentCard}
        ref={scrollRef}
      />
    </div>
  )
}
