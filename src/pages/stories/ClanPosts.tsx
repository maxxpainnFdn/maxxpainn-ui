/**
 * MAXXPAINN — Stories Page (v3 — Tailwind)
 * All inline styles converted to Tailwind classes.
 * Only 6 style= remain: avatar dynamic colors, SVG fill transition,
 * and 4 radial-gradient glows (no Tailwind equivalent).
 */

import { useState, useRef, useEffect } from "react";
import ComposeTrigger from "@/components/stories/ComposeTrigger";
//import SubHeader from "@/components/feeds/SubHeader";
import InfiniteScroll from "@/components/infiniteScroll/InfiniteScroll";
import PostCard from "@/components/stories/PostCard";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "@/types/Post";
import { useAtomValue } from "jotai";
import { userAccountInfoAtom } from "@/store";
import useAuth from "@/hooks/useAuth";
import ApiQuery from "@/components/apiQuery/ApiQuery";
import ApiQueryV2 from "@/components/apiQuery/ApiQueryV2";
import Button from "@/components/button/Button";
import { ArrowLeft } from "lucide-react";


/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function StoriesPage() {

  const { slugId } = useParams();
  const navigate = useNavigate()
  const userAccount = useAtomValue(userAccountInfoAtom)
  
  
  let clanId = null;
  
  if (slugId != null) {
    clanId =  parseInt(slugId.split("-").at(-1))
    if (Number.isNaN(clanId)) {
      return (
        <div className="flex justify-center">
          <div className="bg-white/5 p-5 w-[80%] text-center rounded-xl">
            Invalid Url
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      {slugId && (
        <main className="flex-1 min-w-0 mb-10 pb-10">
          <ComposeTrigger />
          <div className="flex  align-middle">
            <ApiQueryV2
              uri={`/clans/${clanId}`}
              showError={false}
            >
              {(clanInfo) => (
                <>
                  <Button
                    variant="ghost"
                    className="hover:bg-transparent hover:border-transparent"
                    onClick={e=> navigate("/stories")}
                  >
                    <ArrowLeft />
                  </Button>
                  <div className="font-light font-sans text-md md:text-2xl text-maxx-violetLt/90 my-5">
                    {clanInfo.name}
                  </div>
                </>
              )}
            </ApiQueryV2>
          </div>
          <div>
            <InfiniteScroll
              uri="/posts"
              query={{ clanId }}
              className="flex flex-col gap-4"
              renderer={PostCard}
              rendererArgs={{
                currentUser: userAccount,
                onClick: (_, post: Post) => { navigate(`/stories/posts/${post.id}`) }
              }}
            />
          </div>
        </main>
      )}
    </div>
  );
}
