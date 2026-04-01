import { cn } from "@/lib/utils";
import { Hash, Search, X, MessageCircle, Heart, FileText, Castle, UserCircle2  } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type SearchTab = "posts" | "clans" | "users";

const CLANS = [
  { id: "luna-fallen",   name: "Luna Fallen",   emoji: "🌙", members: 4821,  posts: 1204 },
  { id: "ftx-creditors", name: "FTX Creditors", emoji: "💔", members: 11203, posts: 3891 },
  { id: "rug-survivors", name: "Rug Survivors", emoji: "🪦", members: 7654,  posts: 2110 },
  { id: "liq-gang",      name: "Liq Gang",      emoji: "⚡", members: 3390,  posts: 987  },
];

const MOCK_USERS = [
  { handle: "0x7a3f...d9c2",  avatar: "LF", color: "#8b5cf6", bio: "Luna survivor. Pain is temporary.",      followers: 2140 },
  { handle: "degenking.sol",  avatar: "DK", color: "#06b6d4", bio: "50x leverage enjoyer 📉",                followers: 841  },
  { handle: "ftx_refund_wen", avatar: "FR", color: "#ff2d78", bio: "FTX creditor #88291. Still waiting.",    followers: 5320 },
  { handle: "rug_memorial",   avatar: "RM", color: "#10b981", bio: "Rugged 7 times. Still here.",            followers: 430  },
  { handle: "0x9c2b...1f7a",  avatar: "SH", color: "#eab308", bio: "Bridge exploit survivor. DYOR always.", followers: 1220 },
];

function Av({ initials, color, size = 40, round = false }: { initials: string; color: string; size?: number; round?: boolean }) {
  return (
    <div
      className={cn("flex-shrink-0 flex items-center justify-center font-mono font-bold tracking-[0.03em]", round ? "rounded-full" : "rounded-lg")}
      style={{
        width: size, height: size,
        background: `${color}1a`,
        border: `1.5px solid ${color}50`,
        fontSize: size * 0.3,
        color,
      }}
    >
      {initials}
    </div>
  );
}

function EmptySearch({ label }: { label: string }) {
  return (
    <div className="text-center py-12">
      <Search size={22} className="mx-auto mb-2.5 text-maxx-dim opacity-25" />
      <p className="font-mono text-maxx-sub uppercase tracking-widest text-[0.6rem]">{label}</p>
    </div>
  );
}

export default function SearchModal({ onClose, posts }: { onClose: () => void; posts: any[] }) {
  
  const [query, setQuery] = useState("");
  const [tab, setTab]     = useState<SearchTab>("posts");
  const [dq, setDq]       = useState("");
  const inputRef          = useRef<HTMLInputElement>(null);
  const debRef            = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => setDq(query), 200);
    return () => clearTimeout(debRef.current);
  }, [query]);

  const q  = dq.toLowerCase().trim();
  const fp = q ? posts.filter(p => p.content.toLowerCase().includes(q) || p.author.handle.toLowerCase().includes(q)) : posts.slice(0, 5);
  const fc = q ? CLANS.filter(c => c.name.toLowerCase().includes(q)) : CLANS;
  const fu = q ? MOCK_USERS.filter(u => u.handle.toLowerCase().includes(q) || u.bio.toLowerCase().includes(q)) : MOCK_USERS;

  const TABS: { id: SearchTab; label: string; Icon: any; count: number }[] = [
    { id: "posts", label: "Posts", Icon: FileText,    count: fp.length },
    { id: "clans", label: "Clans", Icon: Castle,      count: fc.length },
    { id: "users", label: "Users", Icon: UserCircle2, count: fu.length },
  ];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-start justify-center px-4 pt-20 bg-black/[0.86] backdrop-blur-xl"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="_sp-mi w-full max-w-[580px] max-h-[76vh] rounded-2xl overflow-hidden flex flex-col bg-maxx-bg1 border border-maxx-violet/[0.22]">

        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-maxx-violet/10">
          <Search size={16} className="text-maxx-violet flex-shrink-0" />
          <input
            ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search posts, clans, users..."
            className="flex-1 bg-transparent outline-none text-maxx-bright placeholder:text-maxx-dim font-light font-sans text-[0.95rem]"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-maxx-sub hover:text-maxx-mid transition-colors bg-transparent border-none cursor-pointer">
              <X size={14} />
            </button>
          )}
          <button onClick={onClose} className="font-mono font-bold text-maxx-dim hover:text-maxx-sub transition-colors px-2 py-1 rounded-md bg-transparent border-none cursor-pointer text-[0.6rem] tracking-[0.1em] uppercase">
            ESC
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-maxx-violet/[0.08]">
          {TABS.map(t => {
            const on = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-3 font-mono font-bold transition-colors relative bg-transparent border-none cursor-pointer text-[0.75rem] tracking-[0.08em] uppercase",
                  on ? "text-maxx-white" : "text-maxx-sub"
                )}>
                <t.Icon size={13} />{t.label}
                <span className={cn("font-mono rounded-full px-1.5 py-0.5 ml-0.5 text-[0.6rem]", on ? "bg-maxx-violet/20 text-maxx-violet-lt" : "bg-white/[0.05] text-maxx-dim")}>
                  {t.count}
                </span>
                {on && <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-t-sm bg-gradient-to-r from-maxx-violet to-maxx-pink" />}
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1">
          {tab === "posts" && (fp.length === 0 ? <EmptySearch label="No posts found" /> : fp.map(p => (
            <div key={p.id}
              className="px-4 py-3.5 border-b border-maxx-violet/5 last:border-b-0 cursor-pointer hover:bg-maxx-violet/[0.04] transition-colors">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Av initials={p.author.avatar} color={p.author.color} size={26} />
                <span className="font-semibold text-maxx-bright text-[0.82rem]">{p.author.handle}</span>
                {p.type === "rewarded" && (
                  <span className="font-mono font-bold text-maxx-pink rounded px-1.5 py-0.5 text-[0.6rem] tracking-[0.08em] bg-maxx-pink/10">Rewarded</span>
                )}
                {p.clan && (
                  <span className="font-mono rounded px-1.5 py-0.5 text-maxx-violet-lt text-[0.6rem] bg-maxx-violet/10">{p.clan.emoji} {p.clan.name}</span>
                )}
                <span className="text-maxx-dim ml-auto text-[0.72rem]">{p.ts}</span>
              </div>
              <p className="text-maxx-sub leading-relaxed text-[0.875rem] line-clamp-2">
                {p.content}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-maxx-dim flex items-center gap-1 text-[0.72rem]"><Heart size={11} /> {p.likes.toLocaleString()}</span>
                <span className="text-maxx-dim flex items-center gap-1 text-[0.72rem]"><MessageCircle size={11} /> {p.comments}</span>
              </div>
            </div>
          )))}

          {tab === "clans" && (fc.length === 0 ? <EmptySearch label="No clans found" /> : fc.map(c => (
            <a key={c.id} href={`/clans/${c.id}`}
              className="flex items-center gap-3 px-4 py-3.5 border-b border-maxx-violet/5 last:border-b-0 no-underline hover:bg-maxx-violet/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl bg-maxx-violet/10">{c.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-maxx-bright text-[0.9rem]">{c.name}</p>
                <p className="text-maxx-sub text-[0.75rem]">{c.members.toLocaleString()} members · {c.posts.toLocaleString()} posts</p>
              </div>
              <button
                className="font-mono font-bold rounded-lg px-3 py-1.5 text-maxx-violet-lt flex-shrink-0 bg-maxx-violet/10 border-none cursor-pointer hover:bg-maxx-violet/20 transition-colors text-[0.72rem] tracking-[0.06em] uppercase"
                onClick={e => e.preventDefault()}>
                Join
              </button>
            </a>
          )))}

          {tab === "users" && (fu.length === 0 ? <EmptySearch label="No users found" /> : fu.map(u => (
            <div key={u.handle}
              className="flex items-center gap-3 px-4 py-3.5 border-b border-maxx-violet/5 last:border-b-0 cursor-pointer hover:bg-maxx-violet/[0.04] transition-colors">
              <Av initials={u.avatar} color={u.color} size={40} round />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-maxx-bright text-[0.88rem]">{u.handle}</p>
                <p className="text-maxx-sub mt-0.5 truncate text-[0.82rem]">{u.bio}</p>
                <p className="text-maxx-dim mt-0.5 text-[0.72rem]">{u.followers.toLocaleString()} followers</p>
              </div>
              <button
                className="font-mono font-bold rounded-lg px-3 py-1.5 text-maxx-white flex-shrink-0 border-none cursor-pointer text-[0.68rem] tracking-[0.06em] uppercase bg-gradient-to-br from-violet-700 via-purple-600 to-maxx-pink hover:opacity-85 transition-opacity">
                Follow
              </button>
            </div>
          )))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-maxx-violet/[0.08] flex items-center gap-3">
          <Hash size={12} className="text-maxx-dim" />
          <span className="text-maxx-dim text-[0.75rem]">
            {q ? `Results for "${q}"` : "Trending · type to search"}
          </span>
          <kbd className="ml-auto font-mono text-maxx-dim bg-maxx-violet/[0.08] px-2 py-0.5 rounded text-[0.62rem]">ESC</kbd>
        </div>
      </div>
    </div>
  );
}
