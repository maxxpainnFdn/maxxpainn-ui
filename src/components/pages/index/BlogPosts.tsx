import { useRef, useState } from 'react';
import { ExternalLink, ArrowRight, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import socials from "@/config/socials";

const mediumUrl = `https://medium.com/@${socials.medium ?? 'maxxpainn'}`;

const BLOG_POSTS = [
  {
    tag: "TOKENOMICS",
    tagCol: "#ff2d78",
    title: "Why 100% Fair Launch Is the Only Honest Model Left",
    excerpt: "VCs, insiders, and pre-sales have extracted billions from retail. We're done playing that game. Here's how we built a launch mechanism that can't be gamed.",
    date: "Mar 12, 2025",
    readTime: "6 min read",
    url: "#",
  },
  {
    tag: "PROTOCOL",
    tagCol: "#8b5cf6",
    title: "Pain-to-Power: How We Tokenize Verified Loss Stories",
    excerpt: "The algorithm behind our allocation engine — how we weight loss severity, verify authenticity, and convert collective trauma into a fair token distribution.",
    date: "Feb 28, 2025",
    readTime: "9 min read",
    url: "#",
  },
  {
    tag: "COMMUNITY",
    tagCol: "#34d399",
    title: "Clan Wars: The Governance Layer Nobody Saw Coming",
    excerpt: "Clans aren't just social groups. They're competing governance units with on-chain voting power. Here's what that means for the protocol's long-term direction.",
    date: "Feb 10, 2025",
    readTime: "7 min read",
    url: "#",
  },
  {
    tag: "GOVERNANCE",
    tagCol: "#fbbf24",
    title: "DAO Voting Power: How Pain Score Translates to Influence",
    excerpt: "Your loss story isn't just a token allocation event. It's the foundation of your on-chain governance weight. Here's the full breakdown of the voting model.",
    date: "Jan 25, 2025",
    readTime: "8 min read",
    url: "#",
  },
];

export default function BlogPosts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('a')?.offsetWidth ?? 300;
    el.scrollBy({ left: dir === 'left' ? -cardWidth - 10 : cardWidth + 10, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <div className="eyebrow mb-1"><span className="eyebrow-dot" />// FROM THE ARCHIVES</div>
          <h3 className="font-sans font-black text-[clamp(1.4rem,3.5vw,2.4rem)] uppercase leading-[0.96] text-maxx-white">
            Blog <span className="text-maxx-violet">Posts</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Arrow controls — visible on all sizes */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-8 h-8 rounded-sm border border-maxx-violet/20 bg-maxx-violet/5 flex items-center justify-center text-maxx-mid hover:text-maxx-white hover:border-maxx-violet/50 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-8 h-8 rounded-sm border border-maxx-violet/20 bg-maxx-violet/5 flex items-center justify-center text-maxx-mid hover:text-maxx-white hover:border-maxx-violet/50 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronRight size={15} />
          </button>
          <a
            href={mediumUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[0.68rem] tracking-widest uppercase text-maxx-mid hover:text-maxx-white transition-colors no-underline ml-1"
          >
            <span>All Posts</span>
            <ArrowRight size={12} />
          </a>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Left fade */}
        <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-maxx-bg4 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
        {/* Right fade */}
        <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-maxx-bg4 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-2.5 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {BLOG_POSTS.map((post, i) => (        
            <a  href={post.url}
              key = { i }
              target="_blank"
              rel="noreferrer"
              className="bg-maxx-violet/5 border border-maxx-violet/15 rounded-sm p-4 sm:p-5 no-underline flex flex-col gap-3 transition-all hover:border-maxx-violet/40 hover:bg-maxx-violet/10 group relative overflow-hidden snap-start shrink-0 w-[80vw] sm:w-[340px] lg:w-[calc(33.333%-7px)]"
            >
              <div
                className="absolute top-0 inset-x-0 h-0.5 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
                style={{ background: `linear-gradient(90deg, ${post.tagCol}, transparent)` }}
              />
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[0.62rem] tracking-widest uppercase px-2 py-0.5 rounded-sm border"
                  style={{ color: post.tagCol, borderColor: `${post.tagCol}35`, backgroundColor: `${post.tagCol}12` }}
                >
                  {post.tag}
                </span>
                <ExternalLink size={12} className="text-maxx-sub opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="font-sans font-bold text-[0.88rem] sm:text-[0.95rem] uppercase tracking-wide text-maxx-white leading-[1.3] flex-1">
                {post.title}
              </h4>
              <p className="text-[0.78rem] sm:text-[0.82rem] text-maxx-bright leading-[1.7]">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-maxx-violet/10">
                <span className="inline-flex items-center gap-1 font-mono text-[0.62rem] tracking-widest text-maxx-sub uppercase">
                  <Calendar size={10} />
                  <span>{post.date}</span>
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[0.62rem] tracking-widest text-maxx-sub uppercase">
                  <Clock size={10} />
                  <span>{post.readTime}</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Mobile all posts link */}
      <div className="sm:hidden text-center mt-4">
        <a
          href={mediumUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] tracking-widest uppercase text-maxx-mid hover:text-maxx-white transition-colors no-underline"
        >
          <span>All Posts</span>
          <ArrowRight size={12} />
        </a>
      </div>
    </div>
  );
}
