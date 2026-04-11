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
import ApiQuery from "@/components/apiQuery/ApiQuery";
import EnsureConnected from "@/components/ensureConnected/EnsureConnected";


/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function UserClans() {
  
  const navigate = useNavigate()
  const userAccountInfo = useAtomValue(userAccountInfoAtom)
  const [userClans, setUserClans] = useState<ClanData[]>([])


  return (
    <div>
      <main className="flex-1 min-w-0 mb-10 pb-10">
        <ComposeTrigger />
        <EnsureConnected>
          <ApiQuery
            uri="/account/clan-memberships"
            query={{ memberAccountId: userAccountInfo.id }}
            onSuccess={(dataArr) => setUserClans(dataArr.slice(0, 5))}
            loaderProps={{ clasName: "flex justify-center", spinerSize: 16 }}
          >
            
          </ApiQuery>
        </EnsureConnected>
      </main>
    </div>
  );
}
