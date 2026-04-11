import utils, { cn } from "@/lib/utils";
import { Flame, Bookmark, ArrowRight, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ApiQuery from "../apiQuery/ApiQuery";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { userAccountInfoAtom } from "@/store";
import { ClanData } from "@/types/ClanData";
import ImageAvatar from "../ImageAvatar";
import Button from "../button/Button";


const navItems = [
  { id: "Posts", uri: '/posts', label: "Posts", Icon: Flame      },
  //{ id: "trends", uri: '/posts/trends', label: "Trends", Icon: TrendingUp },
  { id: "saved", uri: '/posts/saved', label: "Saved", Icon: Bookmark },
  { id: "profile", uri: '/account', label: "Profile", Icon: User   },
];

export default function LeftSidebar() {
  
  const location = useLocation()
  const userAccountInfo = useAtomValue(userAccountInfoAtom)

  const [userClans, setUserClans] = useState<ClanData[]>([])
  const [userClansError, setUserClansError] = useState("")
  const [userClansKey, setUserClansKey] = useState(1)
  
  return (
    <div className="">
      <div className="">
        <div className="mb-5">
          <div className="eyebrow mb-2"><span className="eyebrow-dot" />Feed</div>
          <div className="flex flex-col gap-0.5">
            {navItems.map(item => {
              
              const isActive = (location.pathname == item.uri);
              const Icon = item.Icon;
              
              return (
                <Link
                  to={item.uri}
                  className={cn(
                    "flex items-center w-full rounded-xl transition-all text-left bg-transparent border-none cursor-pointer font-sans font-semibold",
                    isActive ? "bg-maxx-violet/[0.12] text-maxx-white" : "text-maxx-sub hover:text-maxx-mid hover:bg-white/[0.03]",
                    "gap-2.5 px-3 py-2.5 text-[0.9rem]"
                  )}>
                  <Icon size={15} className={cn("shrink-0", isActive ? "text-maxx-violet" : "text-maxx-dim")} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
        
        {userAccountInfo != null &&
          <div>
            <div className="eyebrow mb-2"><span className="eyebrow-dot" />My Clans</div>
            {userClansError != "" &&
              <div className="mx-5">
                <div className="text-sm text-maxx-violetLt/80">Failed to load</div>
                <Button variant="ghost" size="sm" onClick={e => {
                  setUserClansError("")
                  setUserClansKey(p => p + 1)
                }}>
                  Reload
                </Button>
              </div>
            }
            <div className="flex flex-col gap-0.5">
              <ApiQuery
                uri="/account/clan-memberships"
                query={{ memberAccountId: userAccountInfo.id }}
                onSuccess={(dataArr) => setUserClans(dataArr.slice(0, 5))}
                onError={err => setUserClansError(err)}
                showError={false}
                loaderProps={{ clasName: "flex justify-center", spinerSize: 16 }}
                key={userClansKey}
              >
                <>
                  {userClans.map(c => (
                    <a key={c.id} href={`/clans/${c.id}`}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl no-underline transition-all font-semibold text-[0.9rem] text-maxx-sub hover:text-maxx-mid hover:bg-white/[0.03]">
                        <ImageAvatar
                          src={utils.getServerImage(c.image, "clans", "tiny")}
                          fallbackText={c.name}
                          className="w-[22px] h-[22px] object-cover text-sm font-bold rounded-full  shadow-xl"
                          fallbackTextClass="bg-maxx-bg/50 text-maxx-white rounded-lg"
                        />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="font-mono text-maxx-dim text-[0.72rem]">{utils.toShortNumber(c.postCount || 0)}</span>
                    </a>
                  ))}
                </>
              </ApiQuery>
              {(userClans.length > 0 && userClansError == "") && (
                <Link to="/stories/my-clans" className="flex items-center gap-2 px-3 py-2 rounded-xl no-underline text-maxx-violet hover:text-maxx-violet-lt transition-colors font-semibold text-[0.85rem]">
                  <ArrowRight size={12} /> All my clans
                </Link>
              )}
            </div>
          </div>
        }
      </div>
    </div>
  );
}
