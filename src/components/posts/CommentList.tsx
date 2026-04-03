import utils from "@/lib/utils";
import InfiniteScroll from "../infiniteScroll/InfiniteScroll";
import CommentCard from "./CommentCard";
import CommentsSorter from "./CommentsSorter";
import { useState } from "react";

export default function CommentList({ postId, totalComments }) {
  
  const [sort, setSort] = useState("newest");

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
      />
    </div>
  )
}
