import { cn } from "@/lib/utils";
import { Flame, Castle, TrendingUp, Award, Bookmark, ArrowRight, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ApiQuery from "../apiQuery/ApiQuery";
import { useState } from "react";

const CLANS = [
  { id: "luna-fallen",   name: "Luna Fallen",   emoji: "🌙", members: 4821,  posts: 1204 },
  { id: "ftx-creditors", name: "FTX Creditors", emoji: "💔", members: 11203, posts: 3891 },
  { id: "rug-survivors", name: "Rug Survivors", emoji: "🪦", members: 7654,  posts: 2110 },
  { id: "liq-gang",      name: "Liq Gang",      emoji: "⚡", members: 3390,  posts: 987  },
];

const navItems = [
  { id: "Posts", uri: '/posts', label: "Posts", Icon: Flame      },
  //{ id: "trends", uri: '/posts/trends', label: "Trends", Icon: TrendingUp },
  { id: "saved", uri: '/posts/saved', label: "Saved", Icon: Bookmark },
  { id: "profile", uri: '/account', label: "Profile", Icon: User   },
];

export default function LeftSidebar() {
  
  const location = useLocation()
  
  const [userClans, setUserClans] = useState([])
  const [userClanError, userClansError] = useState("")
  
  return (
    <div className="hidden lg:block flex-shrink-0 w-[210px] sticky top-[116px]">
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
      <div>
        <div className="eyebrow mb-2"><span className="eyebrow-dot" />My Clans</div>
        <div className="flex flex-col gap-0.5">
          <ApiQuery
            uri="/posts/user-clans"
            onSuccess={(dataArr) => setUserClans(dataArr)}
            onError={ err => userClansError(err) }
            showError={false}
          >
            <>
              {CLANS.slice(0, 3).map(c => (
                <a key={c.id} href={`/clans/${c.id}`}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl no-underline transition-all font-semibold text-[0.9rem] text-maxx-sub hover:text-maxx-mid hover:bg-white/[0.03]">
                  <span className="text-[0.88rem]">{c.emoji}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="font-mono text-maxx-dim text-[0.72rem]">{(c.members / 1000).toFixed(1)}k</span>
                </a>
              ))}
            </>
          </ApiQuery>
          {userClans.length > 0 && (
            <a href="/clans" className="flex items-center gap-2 px-3 py-2 rounded-xl no-underline text-maxx-violet hover:text-maxx-violet-lt transition-colors font-semibold text-[0.85rem]">
              <ArrowRight size={12} /> All clans
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
