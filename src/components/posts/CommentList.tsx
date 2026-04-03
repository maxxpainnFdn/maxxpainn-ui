import InfiniteScroll from "../infiniteScroll/InfiniteScroll";
import CommentCard from "./CommentCard";

export default function CommentList({ postId }) {
  return (
    <div className="">
      <InfiniteScroll
        uri={`/posts/${postId}/comments`}
        className="mt-5"
        renderer={CommentCard}
      />
    </div>
  )
}
