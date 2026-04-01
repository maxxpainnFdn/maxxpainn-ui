/**
 * MAXXPAINN — Stories Page (v3 — Tailwind)
 * All inline styles converted to Tailwind classes.
 * Only 6 style= remain: avatar dynamic colors, SVG fill transition,
 * and 4 radial-gradient glows (no Tailwind equivalent).
 */

import { useState, useRef, useEffect } from "react";
import {
  Flame,
  Clock,
  Skull,
  Search,
  Menu,
} from "lucide-react";
import PostTypePicker from "@/components/posts/PostTypePicker";
import FeedsRightPanel from "@/components/posts/FeedsRightPanel";
import MobileSidebarDrawer from "@/components/posts/MobileSidebarDrawer";
import LeftSidebar from "@/components/posts/LeftSidebar";
import SearchModal from "@/components/posts/SearchModal";
import ComposeModal from "@/components/posts/ComposeModal";
import ComposeTrigger from "@/components/posts/ComposeTrigger";
//import SubHeader from "@/components/feeds/SubHeader";
import InfiniteScroll from "@/components/infiniteScroll/InfiniteScroll";
import PostCard from "@/components/posts/PostCard";
import Navigation from "@/components/nav/Navigation";
import { useNavigate } from "react-router-dom";
import { Post } from "@/types/Post";


/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function StoriesPage() {
  
  const navigate = useNavigate()
  
  const [showTypePicker, setShowTP] = useState(false);
  const [composeType, setCompType] = useState<"normal" | "rewarded" | null>(null);
  const [showSearch, setShowSearch] = useState(false);

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
      <main className="flex-1 min-w-0">
        <ComposeTrigger onClick={() => setShowTP(true)} />
        <div>
          <InfiniteScroll
            uri="/posts"
            className="flex flex-col gap-4"
            renderer={PostCard}
            rendererArgs={{ onClick: (_, post: Post) => {navigate(`/posts/${post.id}`)} }}
          />
        </div>
      </main>
    </div>
  );
}
