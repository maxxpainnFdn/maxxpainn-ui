/**
 * MAXXPAINN — Stories Page (v3 — Tailwind)
 * All inline styles converted to Tailwind classes.
 * Only 6 style= remain: avatar dynamic colors, SVG fill transition,
 * and 4 radial-gradient glows (no Tailwind equivalent).
 */

import { useState, useRef, useEffect } from "react";
import ComposeTrigger from "@/components/posts/ComposeTrigger";
//import SubHeader from "@/components/feeds/SubHeader";
import InfiniteScroll from "@/components/infiniteScroll/InfiniteScroll";
import PostCard from "@/components/posts/PostCard";
import { useNavigate } from "react-router-dom";
import { Post } from "@/types/Post";
import { useAtomValue } from "jotai";
import { userAccountInfoAtom } from "@/store";
import useAuth from "@/hooks/useAuth";
import EnsureConnected from "@/components/ensureConnected/EnsureConnected";


/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function Bookmarks() {
  
  const auth = useAuth()
  const navigate = useNavigate()
  
  const [showTypePicker, setShowTP] = useState(false);
  const [composeType, setCompType] = useState<"normal" | "rewarded" | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  
  const userAccount = useAtomValue(userAccountInfoAtom)
  
    //console.log("userAccount===>", userAccount)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) { e.preventDefault(); setShowSearch(true); }
      if (e.key === "Escape") { setShowSearch(false); setShowTP(false); setCompType(null); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  


  return (
    <div>
      <main className="flex-1 min-w-0 mb-10 pb-10">
        <ComposeTrigger onClick={() => setShowTP(true)} />
        <div className="font-normal text-[1.5rem] text-maxx-bright my-5">Saved Posts</div>
        <EnsureConnected>
          <div key={pageKey}>
            <InfiniteScroll
              uri="/posts/bookmarks"
              className="flex flex-col gap-4"
              renderer={PostCard}
              rendererArgs={{
                currentUser: userAccount,
                onClick: (_, post: Post) => { navigate(`/posts/${post.id}`) },
                onBookmarkStateChange: () => {  setPageKey(Math.random()) }
              }}
            />
          </div>
        </EnsureConnected>
      </main>
    </div>
  );
}
