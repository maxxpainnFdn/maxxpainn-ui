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
import ApiQueryV2 from "@/components/apiQuery/ApiQueryV2";


/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function TopClans() {
  
  const navigate = useNavigate()

  return (
    <div>
      <main className="flex-1 min-w-0 mb-10 pb-10">
        <ComposeTrigger />
        <div className="flex  align-middle">        
          <div className="font-light font-sans text-md md:text-2xl text-maxx-violetLt/90 my-5">Top Clans</div>
        </div>
     
        <ApiQueryV2
          uri="/clans"
          query={{ sortBy: "most_mints" }}
          loaderProps={{ clasName: "flex justify-center", spinerSize: 16 }}
        >
          {(userClans: ClanData[]) => (
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
          )}
        </ApiQueryV2>

      </main>
    </div>
  );
}
