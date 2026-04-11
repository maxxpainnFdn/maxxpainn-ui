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
  
  console.log("postId===>", postId)
  
  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate('/stories')}
        className="mb-6 hover:bg-accent transition-colors items-center"
      >
        <ChevronLeft className="mr-1 h-5 w-5" />
        Posts
      </Button>
      
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
                  console.log("post===>", post)
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
