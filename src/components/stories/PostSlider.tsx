import PostItem from "@/pages/stories/PostItem";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import { useAtomValue } from "jotai";
import { userAccountInfoAtom } from "@/store";
import { Post } from "@/types/Post";

export default function PostSlider({ posts }) {
  
  const navigate = useNavigate();
  const userAccountInfo = useAtomValue(userAccountInfoAtom)

  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const trackRef = useRef(null);

  // Responsive: 1 on <768px, 2 on md+
  useEffect(() => {
    const update = () => {
      const count = window.innerWidth < 768 ? 1 : 2;
      setVisibleCount(count);
      // Reset index if it would go out of bounds
      setCurrentIndex(prev => Math.min(prev, Math.max(0, posts.length - count)));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [posts.length]);

  const maxIndex = Math.max(0, posts.length - visibleCount);
  const totalPages = maxIndex + 1;

  const goTo = useCallback((index) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  }, [maxIndex]);

  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  // Touch/swipe support
  const touchStart = useRef(null);
  const touchDelta = useRef(0);

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
    touchDelta.current = 0;
  };
  const onTouchMove = (e) => {
    if (touchStart.current === null) return;
    touchDelta.current = e.touches[0].clientX - touchStart.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 50) {
      touchDelta.current < 0 ? next() : prev();
    }
    touchStart.current = null;
  };

  // Keyboard support
  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  return (
    <div className="relative group" onKeyDown={onKeyDown} tabIndex={0} role="region" aria-label="Pain post slider">
      {/* Slider viewport */}
      <div
        className="overflow-hidden rounded-lg"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }}
        >
          {posts.map((post, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <PostCard
                key={i}
                data={post}
                currentUser={userAccountInfo}
                onClick={(_, post: Post) => { navigate(`/posts/${post.id}`) }}
                bodyClassName="h-[68px] overflow-hidden ellipsis line-clamp-3"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        disabled={!canPrev}
        aria-label="Previous posts"
        className={`
          absolute top-1/2 -translate-y-1/2 -left-4
          w-10 h-10 rounded-full
          flex items-center justify-center
          bg-maxx-bg2 border border-maxx-violet/20
          text-maxx-mid
          transition-all duration-200
          hover:border-maxx-violet hover:text-maxx-white hover:bg-maxx-violet/15
          focus:outline-none focus:ring-2 focus:ring-maxx-violet/40
          disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-maxx-violet/20 disabled:hover:text-maxx-mid disabled:hover:bg-maxx-bg2
          md:-left-5 md:w-11 md:h-11
          z-10
        `}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        disabled={!canNext}
        aria-label="Next posts"
        className={`
          absolute top-1/2 -translate-y-1/2 -right-4
          w-10 h-10 rounded-full
          flex items-center justify-center
          bg-maxx-bg2 border border-maxx-violet/20
          text-maxx-mid
          transition-all duration-200
          hover:border-maxx-violet hover:text-maxx-white hover:bg-maxx-violet/15
          focus:outline-none focus:ring-2 focus:ring-maxx-violet/40
          disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-maxx-violet/20 disabled:hover:text-maxx-mid disabled:hover:bg-maxx-bg2
          md:-right-5 md:w-11 md:h-11
          z-10
        `}
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination dots */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`
                rounded-full transition-all duration-300
                ${i === currentIndex
                  ? 'w-7 h-2 bg-maxx-violet'
                  : 'w-2 h-2 bg-maxx-violet/25 hover:bg-maxx-violet/50'
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}
