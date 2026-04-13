import Button from "@/components/button/Button";
import PostCard from "@/components/stories/PostCard";
import { useApi } from "@/hooks/useApi";
import { Post } from "@/types/Post";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useAtomValue } from "jotai";
import { userAccountInfoAtom } from "@/store";
import ApiQueryV2 from "@/components/apiQuery/ApiQueryV2";
import ComposeTrigger from "@/components/stories/ComposeTrigger";


export default function PostItem() {
  
  const auth = useAuth()
  const userAccountInfo = useAtomValue(userAccountInfoAtom)

  const { postId } = useParams();
  const navigate = useNavigate();
  
  const [pageError, setPageError] = useState<string>("")
  const [initialized, setInitialized] = useState<boolean>(false)
  
  
  useEffect(() => {
    
    setPageError("")
    setInitialized(false)
    
    if (postId != null) {
      
      if (!/[0-9]+/.test(postId)) {
        setPageError("Invalid URL")
        setInitialized(true)
        return;
      }
      
      const postIdNo = Number(postId)
      if (Number.isNaN(postIdNo) || postIdNo <= 0) {
        setPageError("Invalid Post")
        setInitialized(true)
        return;
      }
      
      setInitialized(true)
    }
  })
  
  
  return (
    <div>
      <ComposeTrigger  />
      <div className="flex  align-middle">     
        <Button
          variant="ghost"
          className="hover:bg-transparent hover:border-transparent pl-0 ps-0"
          onClick={e=> navigate("/stories")}
        >
          <ArrowLeft />
        </Button>   
        <div className="font-light font-sans text-md md:text-2xl text-maxx-violetLt/90 my-5">Posts</div>
      </div>
      
      {initialized && (
        <div>
          {pageError != ""
            ? <div className="flex justify-center">
              <div className="bg-white/5 p-5 w-[80%] text-center rounded-xl">
                {pageError}
              </div>
            </div>
            : <>
              <ApiQueryV2
                uri={`/posts/${postId}`}
              >
                {(post: Post) => {
                  return (
                    <>
                      {post == null ?
                        <div className="flex justify-center">
                          <div className="bg-white/5 p-5 w-[80%] text-center rounded-xl">
                            Post not found
                          </div>
                        </div>
                        :
                        <PostCard
                          data={post}
                          onClick={(e) => e.preventDefault()}
                          currentUser={userAccountInfo}
                        />
                      }
                    </>
                  )
                }}
              </ApiQueryV2>
            </>
          }
        </div>
      )}
    </div>
  )
}
