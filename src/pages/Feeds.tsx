import React, { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Heart,
  Flame,
  Send,
  ShieldCheck,
  Users,
  PenSquare,
} from "lucide-react";

type Clan = {
  id: string;
  name: string;
  tag: string;
  slug: string;
  members: number;
  online: number;
};

type FeedPost = {
  id: string;
  authorName: string;
  authorHandle: string;
  clanId: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: number;
  boosted: number;
};

const CLANS: Clan[] = [
  { id: "void-raiders", name: "Void Raiders", tag: "VOID", slug: "void-raiders", members: 1244, online: 182 },
  { id: "alpha-wolves", name: "Alpha Wolves", tag: "AWLF", slug: "alpha-wolves", members: 938, online: 121 },
  { id: "night-oracle", name: "Night Oracle", tag: "NITE", slug: "night-oracle", members: 642, online: 88 },
];

const CURRENT_USER = {
  name: "MAXX User",
  handle: "@maxxdegen",
  clanIds: ["void-raiders", "alpha-wolves"], // user communities
};

const SEED_POSTS: FeedPost[] = [
  {
    id: "p1",
    authorName: "Ash",
    authorHandle: "@ashvoid",
    clanId: "void-raiders",
    content: "Stacked more this dip. Pain is temporary. Conviction is forever.",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    likes: 22,
    replies: 4,
    boosted: 2,
  },
  {
    id: "p2",
    authorName: "Nora",
    authorHandle: "@noraalpha",
    clanId: "alpha-wolves",
    content: "Clan mission tonight: 20 holders onboarding challenge. Let’s run it.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likes: 41,
    replies: 9,
    boosted: 7,
  },
  {
    id: "p3",
    authorName: "Hex",
    authorHandle: "@hexnite",
    clanId: "night-oracle",
    content: "Charts look chaotic, vibes look pristine.",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    likes: 17,
    replies: 3,
    boosted: 1,
  },
];

function timeAgo(iso: string) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function SocialFeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>(SEED_POSTS);
  const [draft, setDraft] = useState("");
  const [filterClan, setFilterClan] = useState<string>("all");

  const userClans = useMemo(
    () => CLANS.filter((c) => CURRENT_USER.clanIds.includes(c.id)),
    []
  );

  const clanById = useMemo(
    () => Object.fromEntries(CLANS.map((c) => [c.id, c])),
    []
  );

  const [selectedClanId, setSelectedClanId] = useState<string>(
    userClans[0]?.id ?? ""
  );

  const canPost = draft.trim().length > 0 && selectedClanId.length > 0;

  const filteredPosts = posts.filter((p) =>
    filterClan === "all" ? true : p.clanId === filterClan
  );

  function onSubmitPost(e: FormEvent) {
    e.preventDefault();
    if (!canPost) return;

    const newPost: FeedPost = {
      id: `p-${Date.now()}`,
      authorName: CURRENT_USER.name,
      authorHandle: CURRENT_USER.handle,
      clanId: selectedClanId, // required
      content: draft.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: 0,
      boosted: 0,
    };

    setPosts((prev) => [newPost, ...prev]);
    setDraft("");
  }

  return (
    <main className="min-h-screen bg-maxx-bg0 text-maxx-white pb-14">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Header */}
        <header className="mb-8">
          <div className="eyebrow mb-3">
            <span className="eyebrow-dot" />
            Community Feed
          </div>
          <h1 className="font-sans font-black tracking-tight text-3xl md:text-4xl text-maxx-white">
            Clan Social
          </h1>
          <p className="text-sm text-maxx-sub mt-3 max-w-2xl leading-relaxed">
            Post updates, rally your people, and keep the timeline degen-sharp.
            Every post belongs to a clan community.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Composer + Feed */}
          <section className="lg:col-span-8 space-y-5">
            {/* Composer */}
            <form
              onSubmit={onSubmitPost}
              className="rounded-xl border border-maxx-violet/15 bg-maxx-violet/4 p-4 md:p-5"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-maxx-violet/20 border border-maxx-violet/25 flex items-center justify-center">
                    <PenSquare size={14} className="text-maxx-violet" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-maxx-bright">
                      Post status
                    </p>
                    <p className="text-sm text-maxx-sub">
                      as {CURRENT_USER.handle}
                    </p>
                  </div>
                </div>

                <div className="pill px-3 py-1 border border-maxx-violet/20 text-sm text-maxx-sub">
                  Clan required
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <label className="md:col-span-1">
                  <span className="text-sm text-maxx-sub block mb-1.5">
                    Post to clan
                  </span>
                  <select
                    value={selectedClanId}
                    onChange={(e) => setSelectedClanId(e.target.value)}
                    className="w-full h-10 rounded-md bg-maxx-bg0 border border-maxx-violet/20 text-sm text-maxx-bright px-3 outline-none focus:border-maxx-violet/40"
                  >
                    {userClans.length === 0 ? (
                      <option value="">Join a clan first</option>
                    ) : (
                      userClans.map((clan) => (
                        <option key={clan.id} value={clan.id}>
                          {clan.name} · {clan.tag}
                        </option>
                      ))
                    )}
                  </select>
                </label>

                <label className="md:col-span-2">
                  <span className="text-sm text-maxx-sub block mb-1.5">
                    Status
                  </span>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={280}
                    rows={4}
                    placeholder="What pain did you convert into power today?"
                    className="w-full rounded-md bg-maxx-bg0 border border-maxx-violet/20 text-sm text-maxx-bright px-3 py-2.5 outline-none resize-none focus:border-maxx-violet/40 placeholder:text-maxx-dim"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-maxx-dim">
                  {draft.length}/280 characters
                </p>
                <button
                  type="submit"
                  disabled={!canPost}
                  className="h-10 px-4 rounded-md border border-maxx-violet/25 bg-maxx-violet/10 text-sm text-maxx-bright transition-all hover:bg-maxx-violet/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={14} />
                  Publish to clan
                </button>
              </div>
            </form>

            {/* Feed filters */}
            <div className="rounded-xl border border-maxx-violet/15 bg-maxx-violet/3 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFilterClan("all")}
                  className={`h-9 px-3 rounded-md border text-sm transition-all ${
                    filterClan === "all"
                      ? "border-maxx-violet/40 bg-maxx-violet/12 text-maxx-bright"
                      : "border-maxx-violet/20 text-maxx-sub hover:border-maxx-violet/35 hover:text-maxx-bright"
                  }`}
                >
                  All clans
                </button>

                {CLANS.map((clan) => (
                  <button
                    key={clan.id}
                    onClick={() => setFilterClan(clan.id)}
                    className={`h-9 px-3 rounded-md border text-sm transition-all ${
                      filterClan === clan.id
                        ? "border-maxx-violet/40 bg-maxx-violet/12 text-maxx-bright"
                        : "border-maxx-violet/20 text-maxx-sub hover:border-maxx-violet/35 hover:text-maxx-bright"
                    }`}
                  >
                    {clan.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed list */}
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const clan = clanById[post.clanId];
                return (
                  <article
                    key={post.id}
                    className="rounded-xl border border-maxx-violet/15 bg-maxx-violet/4 p-4 md:p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-maxx-bright">
                          {post.authorName}
                          <span className="text-maxx-sub font-normal">
                            {" "}
                            · {post.authorHandle}
                          </span>
                        </p>
                        <p className="text-sm text-maxx-dim">{timeAgo(post.createdAt)}</p>
                      </div>

                      <Link
                        to={`/clans/${clan.slug}`}
                        className="pill px-2.5 py-1 border border-maxx-violet/25 text-sm text-maxx-sub no-underline hover:text-maxx-bright hover:border-maxx-violet/40"
                      >
                        {clan.tag} · {clan.name}
                      </Link>
                    </div>

                    <p className="text-sm text-maxx-sub leading-relaxed mb-4">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4">
                      <button className="text-sm text-maxx-dim hover:text-maxx-bright flex items-center gap-1.5">
                        <Heart size={14} /> {post.likes}
                      </button>
                      <button className="text-sm text-maxx-dim hover:text-maxx-bright flex items-center gap-1.5">
                        <MessageCircle size={14} /> {post.replies}
                      </button>
                      <button className="text-sm text-maxx-dim hover:text-maxx-bright flex items-center gap-1.5">
                        <Flame size={14} /> {post.boosted}
                      </button>
                    </div>
                  </article>
                );
              })}

              {filteredPosts.length === 0 && (
                <div className="rounded-xl border border-maxx-violet/15 bg-maxx-violet/4 p-6 text-sm text-maxx-sub">
                  No posts for this clan yet. Be the first degen to break the silence.
                </div>
              )}
            </div>
          </section>

          {/* Right: Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="rounded-xl border border-maxx-violet/15 bg-maxx-violet/4 p-4">
              <div className="eyebrow mb-3">
                <span className="eyebrow-dot" />
                Clan Rooms
              </div>
              <ul className="space-y-2.5">
                {CLANS.map((clan) => (
                  <li key={clan.id}>
                    <Link
                      to={`/clans/${clan.slug}`}
                      className="no-underline rounded-md border border-maxx-violet/15 hover:border-maxx-violet/35 px-3 py-2.5 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm text-maxx-bright font-semibold">
                          {clan.name}
                        </p>
                        <p className="text-sm text-maxx-dim">{clan.tag}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-maxx-sub flex items-center gap-1 justify-end">
                          <Users size={13} /> {clan.members}
                        </p>
                        <p className="text-sm text-maxx-dim">{clan.online} online</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-maxx-violet/15 bg-maxx-violet/4 p-4">
              <div className="eyebrow mb-3">
                <span className="eyebrow-dot" />
                Posting Rules
              </div>
              <ul className="space-y-2">
                <li className="text-sm text-maxx-sub flex gap-2">
                  <ShieldCheck size={14} className="text-maxx-violet mt-0.5" />
                  Every status must target a clan community.
                </li>
                <li className="text-sm text-maxx-sub flex gap-2">
                  <ShieldCheck size={14} className="text-maxx-violet mt-0.5" />
                  Keep it alpha, no spam.
                </li>
                <li className="text-sm text-maxx-sub flex gap-2">
                  <ShieldCheck size={14} className="text-maxx-violet mt-0.5" />
                  Respect clan walls and community rules.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
