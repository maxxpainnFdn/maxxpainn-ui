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
import TitleAndBackBtn from "@/components/stories/TitleAndBackBtn";


/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function UserClans() {
  
  const navigate = useNavigate()
  const userAccountInfo = useAtomValue(userAccountInfoAtom)

  return (
    <div>
      <main className="flex-1 min-w-0 mb-10 pb-10">
        <ComposeTrigger />
        
        <TitleAndBackBtn title="My Clans" />
        
        <EnsureConnected>
          { userAccountInfo && (
            <ApiQueryV2
              uri="/account/clan-memberships"
              query={{ memberAccountId: userAccountInfo.id }}
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
          )}
        </EnsureConnected>
      </main>
    </div>
  );
}
