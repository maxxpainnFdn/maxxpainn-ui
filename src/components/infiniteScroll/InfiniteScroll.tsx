import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useVirtualizer } from '@tanstack/react-virtual';
import Spinner from '../spinner/Spinner';
import { PagingInfo } from '@/types/PagingInfo';
import { useApi } from '@/hooks/useApi';
import { Post } from '@/types/Post';
import Button from '../button/Button';
import { AlertCircle } from 'lucide-react';

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
  onInitialized?: (dataArr: any, setDataArr: any) => void;
}

const PULL_THRESHOLD = 80;
const MAX_RETRIES = 3;

const InfiniteScroll = forwardRef<InfiniteScrollRef, InfiniteScrollProps>(({
  uri,
  query = {},
  renderer,
  rendererArgs = {},
  className = '',
  estimatedItemHeight = 100,
}, ref) => {
    
  const api = useApi();

  const [dataArr, setDataArr] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pagingInfoRef = useRef<PagingInfo | null>(null);
  const isMounted = useRef(true);
  const retriesRef = useRef(0);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // The virtualizer needs a scrollable parent — we use window scroll
  const virtualizer = useVirtualizer({
    count: hasMore ? dataArr.length + 1 : dataArr.length, // +1 for sentinel row
    getScrollElement: () => document.documentElement,     // window scroll
    estimateSize: () => estimatedItemHeight,
    overscan: 5,                                          // render 5 extra items above/below
  });

  const virtualItems = virtualizer.getVirtualItems();
  
  
  // Disable Chrome native pull-to-refresh
  useEffect(() => {
    document.body.style.overscrollBehaviorY = 'none';
    return () => { document.body.style.overscrollBehaviorY = ''; };
  }, []);

  // Non-passive touchmove to allow preventDefault
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

  // Initial load / re-fetch on prop change
  useEffect(() => {
    isMounted.current = true;
    retriesRef.current = 0;
    fetchData(1, true);
    return () => { isMounted.current = false; };
  }, [uri, JSON.stringify(query)]);

  // Infinite scroll trigger
  useEffect(() => {
    if (!inView || !hasMore || loading) return;
    if (retriesRef.current >= MAX_RETRIES) return;
    const nextPage = pagingInfoRef.current?.nextPage;
    if (nextPage != null) fetchData(nextPage, false);
  }, [inView, hasMore, loading]);

  const fetchData = async (pageNo: number, isRefresh: boolean) => {
    if (loading) return;
    setLoading(true);
    setError('');

    const resultStatus = await api.get(uri, { ...query, pageNo });
    
    console.log("resultStatus===>", resultStatus)

    if (!isMounted.current) return;

    if (resultStatus.isError()) {
      retriesRef.current += 1;
      setError(resultStatus.getMessage());
      setLoading(false);
      return;
    }

    retriesRef.current = 0;
    
    const dataObj = resultStatus.getData<{ pagingInfo: PagingInfo; data: any[] }>();
    
    
    pagingInfoRef.current = dataObj.pagingInfo;
    setHasMore(dataObj.pagingInfo.nextPage != null);
    setDataArr(prev => (isRefresh ? dataObj.data : [...prev, ...dataObj.data]));
    setLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    retriesRef.current = 0;
    pagingInfoRef.current = null;
    setHasMore(true);
    virtualizer.scrollToIndex(0);
    await fetchData(1, true);
    setIsRefreshing(false);
  };

  const handleLoadMore = () => {
    retriesRef.current = 0;
    setError('');
    const nextPage = pagingInfoRef.current?.nextPage ?? 1;
    fetchData(nextPage, false);
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
  
  const addData = (data: any) => {
    setDataArr(prev => ([data, ...prev]));
    virtualizer.scrollToIndex(0, { align: 'start', behavior: 'smooth' });
  }

  const pullTriggered = pullDistance >= PULL_THRESHOLD;
  const Renderer = renderer;
  
  useImperativeHandle(ref, () => ({
    addData
  }));

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
      
      {(!loading && error == "" && !hasMore && dataArr.length === 0) ? (
        <div className="flex justify-center">
          <div className="bg-white/5 p-5 w-[80%] text-center rounded-xl">No data found</div>
        </div>
      ) : (
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: '100%',
              position: 'relative',
            }}
          >
              
            {virtualItems.map(virtualRow => {
                
              const isLoaderRow = virtualRow.index >= dataArr.length;
                
              //console.log("isLoaderRow===>", isLoaderRow)
                
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement} // ← measures actual height for accuracy
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    // Sentinel / footer row
                    <div ref={sentinelRef} className="py-6 flex flex-col items-center gap-2">
                      {loading && !isRefreshing && <Spinner size={16} />}
      
                      {!loading && error && (
                        <div className="flex justify-center w-full">
                          <div className="bg-white/5 p-5 w-[80%] text-center text-pink-300 pt-8 mb-5 rounded-xl">
                            <div className="">{error}</div>
                            <Button
                              variant="ghost"
                              onClick={handleLoadMore}
                            >
                              Retry
                            </Button>
                          </div>
                        </div>
                      )}
      
                      {!loading && !error && !hasMore && dataArr.length > 0 && (
                        <span className="text-sm text-gray-400">No more data</span>
                      )}
                      
                    </div>
                  ) : (
                    <Renderer data={dataArr[virtualRow.index]} {...rendererArgs} />
                  )}
                </div>
              );
            })}
          </div>
      )}
    </div>
  );
});

export default InfiniteScroll;
