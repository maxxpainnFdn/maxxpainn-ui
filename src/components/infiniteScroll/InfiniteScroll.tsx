import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import Spinner from '../spinner/Spinner';
import { PagingInfo } from '@/types/PagingInfo';
import { useApi } from '@/hooks/useApi';
import Button from '../button/Button';

export type InfiniteScrollRef = {
  addData: (data: any) => void;
};

export interface InfiniteScrollProps {
  uri: string;
  query?: Record<string, any>;
  renderer: any;
  rendererArgs?: Record<string, any> | null;
  className?: string;
  estimatedItemHeight?: number;
  /** How long (ms) fetched data is considered fresh. Default: 2 min */
  staleTime?: number;
  /** How long (ms) unused cache is kept in memory. Default: 5 min */
  gcTime?: number;
}

interface PageResult {
  pagingInfo: PagingInfo;
  data: any[];
}

const PULL_THRESHOLD = 80;

const InfiniteScroll = forwardRef<InfiniteScrollRef, InfiniteScrollProps>(
  (
    {
      uri,
      query = {},
      renderer,
      rendererArgs = {},
      className = '',
      estimatedItemHeight = 100,
      staleTime = 2 * 60 * 1000,
      gcTime = 5 * 60 * 1000,
    },
    ref
  ) => {
    const api = useApi();
    const queryClient = useQueryClient();

    // Stable cache key — changes whenever uri or query change
    const queryKey = [uri, query] as const;

    // ── TanStack infinite query ──────────────────────────────────────────────
    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isFetching,
      isError,
      error: queryError,
      refetch,
    } = useInfiniteQuery<PageResult, Error>({
      queryKey,
      queryFn: async ({ pageParam = 1 }) => {
        const resultStatus = await api.get(uri, {
          ...query,
          pageNo: pageParam as number,
        });
        if (resultStatus.isError()) {
          throw new Error(resultStatus.getMessage());
        }
        return resultStatus.getData<PageResult>();
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.pagingInfo.nextPage ?? undefined,
      staleTime,
      gcTime,
      retry: 3,
    });

    // Flatten pages into a single array
    const dataArr: any[] = data?.pages.flatMap((page) => page.data) ?? [];
    const hasMore = !!hasNextPage;
    const loading = isFetching;
    const error = isError ? (queryError?.message ?? 'Something went wrong') : '';

    // ── Pull-to-refresh state ────────────────────────────────────────────────
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const touchStartY = useRef(0);
    const isPulling = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { ref: sentinelRef, inView } = useInView({
      threshold: 0,
      triggerOnce: false,
    });

    // ── Virtualizer ──────────────────────────────────────────────────────────
    const virtualizer = useVirtualizer({
      count: hasMore ? dataArr.length + 1 : dataArr.length,
      getScrollElement: () => document.documentElement,
      estimateSize: () => estimatedItemHeight,
      overscan: 5,
    });

    const virtualItems = virtualizer.getVirtualItems();

    // ── Disable Chrome native pull-to-refresh ────────────────────────────────
    useEffect(() => {
      document.body.style.overscrollBehaviorY = 'none';
      return () => {
        document.body.style.overscrollBehaviorY = '';
      };
    }, []);

    // ── Non-passive touchmove ────────────────────────────────────────────────
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const handleTouchMove = (e: TouchEvent) => {
        if (!isPulling.current || isRefreshing) return;
        const delta = e.touches[0].clientY - touchStartY.current;
        if (delta < 0) {
          setPullDistance(0);
          return;
        }
        e.preventDefault();
        setPullDistance(Math.min(delta * 0.4, PULL_THRESHOLD * 1.5));
      };

      el.addEventListener('touchmove', handleTouchMove, { passive: false });
      return () => el.removeEventListener('touchmove', handleTouchMove);
    }, [isRefreshing]);

    // ── Infinite scroll trigger ──────────────────────────────────────────────
    useEffect(() => {
      if (!inView || !hasMore || isFetchingNextPage) return;
      fetchNextPage();
    }, [inView, hasMore, isFetchingNextPage, fetchNextPage]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleRefresh = async () => {
      setIsRefreshing(true);
      virtualizer.scrollToIndex(0);
      await refetch();
      setIsRefreshing(false);
    };

    const handleLoadMore = () => {
      fetchNextPage();
    };

    const onTouchStart = (e: React.TouchEvent) => {
      if (window.scrollY > 0) return;
      touchStartY.current = e.touches[0].clientY;
      isPulling.current = true;
    };

    const onTouchEnd = () => {
      isPulling.current = false;
      if (pullDistance >= PULL_THRESHOLD) handleRefresh();
      setPullDistance(0);
    };

    // ── Imperative handle: optimistic prepend ─────────────────────────────────
    const addData = (newItem: any) => {
      queryClient.setQueryData<InfiniteData<PageResult>>(queryKey, (old) => {
        if (!old) return old;
        const [firstPage, ...rest] = old.pages;
        return {
          ...old,
          pages: [
            { ...firstPage, data: [newItem, ...firstPage.data] },
            ...rest,
          ],
        };
      });
      virtualizer.scrollToIndex(0, { align: 'start', behavior: 'smooth' });
    };

    useImperativeHandle(ref, () => ({ addData }));

    // ── Render ────────────────────────────────────────────────────────────────
    const pullTriggered = pullDistance >= PULL_THRESHOLD;
    const Renderer = renderer;

    return (
      <div
        ref={containerRef}
        className={className}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Pull-to-refresh indicator */}
        <div
          style={{
            height: isRefreshing ? PULL_THRESHOLD : pullDistance,
            transition: isPulling.current ? 'none' : 'height 0.3s ease',
            overflow: 'hidden',
          }}
          className="flex items-center justify-center"
        >
          {isRefreshing ? (
            <Spinner size={20} />
          ) : (
            <span
              className="text-sm text-gray-400 transition-opacity"
              style={{ opacity: pullDistance > 10 ? 1 : 0 }}
            >
              {pullTriggered ? '↑ Release to refresh' : '↓ Pull to refresh'}
            </span>
          )}
        </div>

        {loading && dataArr.length === 0 ? (
          <div className="flex justify-center py-10">
            <Spinner size={20} />
          </div>
        ) : !loading && !error && !hasMore && dataArr.length === 0 ? (
          <div className="flex justify-center">
            <div className="bg-white/5 p-5 w-[80%] text-center rounded-xl">
              No data found
            </div>
          </div>
        ) : (
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualItems.map((virtualRow) => {
              const isLoaderRow = virtualRow.index >= dataArr.length;

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    <div
                      ref={sentinelRef}
                      className="py-6 flex flex-col items-center gap-2"
                    >
                      {isFetchingNextPage && <Spinner size={16} />}

                      {!isFetchingNextPage && error && (
                        <div className="flex justify-center w-full">
                          <div className="bg-white/5 p-5 w-[80%] text-center text-pink-300 pt-8 mb-5 rounded-xl">
                            <div>{error}</div>
                            <Button variant="ghost" onClick={handleLoadMore}>
                              Retry
                            </Button>
                          </div>
                        </div>
                      )}

                      {!isFetchingNextPage && !error && !hasMore && dataArr.length > 0 && (
                        <span className="text-sm text-gray-400">
                          No more data
                        </span>
                      )}
                    </div>
                  ) : (
                    <Renderer
                      data={dataArr[virtualRow.index]}
                      {...rendererArgs}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

export default InfiniteScroll;
