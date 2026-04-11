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
import { ClanData } from "@/types/ClanData";
import ClanCard from "@/components/clans/ClanCard";


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
        <div className="flex  align-middle">        
          <div className="font-bold text-md text-maxx-violetLt/60 my-5">My Clans</div>
        </div>
        <EnsureConnected>
          { userAccountInfo && (
            <ApiQuery
              uri="/account/clan-memberships"
              query={{ memberAccountId: userAccountInfo.id }}
              onSuccess={(dataArr) => setUserClans(dataArr.slice(0, 5))}
              loaderProps={{ clasName: "flex justify-center", spinerSize: 16 }}
            >
              <div className="flex flex-wrap justify-center gap-3">
                {userClans.map((clan: any, i: number) => (
                  <div key={clan.id} className="flex-shrink-0 basis-[100px]">
                    <ClanCard
                      clan={clan}
                      index={i}
                      width="200px"
                      imageHeight="120px"
                      showJoinBtn={false}
                      onItemClick={e=> navigate(`/stories/clan/${clan.slug}-${clan.id}`)}
                    />
                  </div>
                ))}
              </div>
            </ApiQuery>
          )}
        </EnsureConnected>
      </main>
    </div>
  );
}
