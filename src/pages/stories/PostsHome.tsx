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
import { useNavigate } from "react-router-dom";
import { Post } from "@/types/Post";
import { useAtomValue } from "jotai";
import { userAccountInfoAtom } from "@/store";
import useAuth from "@/hooks/useAuth";


/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function StoriesPage() {
  
  const navigate = useNavigate()
  const userAccount = useAtomValue(userAccountInfoAtom)
  

  return (
    <div>
      <main className="flex-1 min-w-0 mb-10 pb-10">
        <ComposeTrigger />
        <div>
          <InfiniteScroll
            uri="/posts"
            className="flex flex-col gap-4"
            renderer={PostCard}
            rendererArgs={{
              currentUser: userAccount,
              onClick: (_, post: Post) => { navigate(`/stories/posts/${post.id}`) }
            }}
          />
        </div>
      </main>
    </div>
  );
}
