import { ArrowRight, BarChart2, ChevronRight, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ImageAvatar from "../ImageAvatar.tsx";
import { ClanData } from "@/types/ClanData";
import utils from "@/lib/utils";
import Button from "../button/Button.tsx";
import { tokenConfig } from "@/config/token";
import ApiQueryV2 from "../apiQuery/ApiQueryV2.tsx";


export default function RightSidebar() {
  
  const [topClansError, setTopClansError] = useState("")
  const [topClansKey, setTopClansKey] = useState(1)
  
  return (
    <div className="flex flex-col gap-3">
      {/* Active Clans */}
      <div className="rounded-2xl overflow-hidden bg-maxx-bg2/88">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={13} className="text-maxx-violet" />
            <span className="font-mono font-bold text-maxx-bright uppercase tracking-wider text-[0.72rem]">Top Clans</span>
          </div>
          {topClansError != "" &&
            <div className="mx-5">
              <div className="text-sm text-maxx-violetLt/80">Failed to load</div>
              <Button variant="ghost" size="sm" onClick={e => {
                setTopClansError("")
                setTopClansKey(p => p + 1)
              }}>
                Reload
              </Button>
            </div>
          }
          <ApiQueryV2
            uri="/clans"
            query={{ sortBy: "most_mints" }}
            onError={err => setTopClansError(err)}
            showError={false}
            loaderProps={{ clasName: "flex justify-center", spinerSize: 16 }}
            key={topClansKey}
          >
            {(data: ClanData[]) => {
              
              const clansData = data.slice(0, 5);
              
              return (
                <>
                  <div className="flex flex-col gap-1 max-h-[380px] overflow-y-scroll">
                    {clansData.map((c, k) => (
                      <Link key={k} to={`/stories/clan/${c.slug}-${c.id}`}
                        className="flex items-center justify-between py-2 px-2 no-underline rounded-lg transition-colors hover:bg-maxx-violet/[0.06] group/clan">
                        <div className="flex items-center gap-2.5">
                          <ImageAvatar
                            src={utils.getServerImage(c.image, "clans", "tiny")}
                            fallbackText={c.name}
                            className="w-[22px] h-[22px] object-cover text-sm font-bold rounded-full  shadow-xl"
                            fallbackTextClass="bg-maxx-bg/50 text-maxx-white rounded-lg"
                          />
                          <div>
                            <div className="font-semibold text-maxx-bright group-hover/clan:text-maxx-white transition-colors text-[0.85rem]">{c.name}</div>
                            <div className="text-maxx-sub text-[0.72rem]">{c.totalMints} mints</div>
                          </div>
                        </div>
                        <ChevronRight size={13} className="text-maxx-dim group-hover/clan:text-maxx-violet transition-colors" />
                      </Link>
                    ))}
                  </div>
                  <Link to="/stories/top-clans" className="flex items-center gap-2 px-3 py-2 rounded-xl no-underline text-maxx-violet hover:text-maxx-violet-lt transition-colors font-semibold text-[0.85rem]">
                    <ArrowRight size={12} /> All top clans
                  </Link>
                </>
              )
            }}
          </ApiQueryV2>
        </div>
      </div>

      {/* Mint CTA */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-maxx-pink/[0.06]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-maxx-pink to-maxx-violet" />
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(255,45,120,0.2),transparent 70%)" }} />
        <Zap size={16} className="text-maxx-pink mb-2" fill="currentColor" />
        <h4 className="font-black text-maxx-white mb-1.5 uppercase font-mono text-[0.95rem] tracking-[0.04em]">Earn From Your Pain</h4>
        <p className="text-maxx-sub mb-3.5 leading-relaxed text-[0.82rem]">
          Share your story and get rewarded with ${tokenConfig.symbol} tokens.
        </p>
        <Link to="/mint" className="flex justify-center">
          <Button size="sm"><Zap size={12} /> Post Your Story</Button>
        </Link>
      </div>
    </div>
  );
}
