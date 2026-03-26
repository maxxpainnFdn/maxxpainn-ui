import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Spinner from '../spinner/Spinner';
import { PagingInfo } from '@/types/PagingInfo';
import { useApi } from '@/hooks/useApi';
import { Post } from '@/types/Post';

export interface InfiniteScrollProps {
  uri: string;
  query?: Record<string, any>;
  renderer: any;
  rendererArgs?: Record<string, any> | null;
  className?: string;
}

const PULL_THRESHOLD = 80;

export default function InfiniteScroll({
  uri,
  query = {},
  renderer,
  rendererArgs = {},
  className = '',
}: InfiniteScrollProps) {
  const api = useApi();

  const [dataArr, setDataArr] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);

  const pagingInfoRef = useRef<PagingInfo | null>(null);
  const isMounted = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
      e.preventDefault(); // ← works now because listener is non-passive
      setPullDistance(Math.min(delta * 0.4, PULL_THRESHOLD * 1.5));
    };
  
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', handleTouchMove);
  }, [isRefreshing]);

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    // Disable Chrome's native pull-to-refresh
    document.body.style.overscrollBehaviorY = 'none';
    return () => { document.body.style.overscrollBehaviorY = ''; };
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchData(1, true);
    return () => { isMounted.current = false; };
  }, [uri, JSON.stringify(query)]);

  useEffect(() => {
    if (!inView || !hasMore || loading) return;
    const nextPage = pagingInfoRef.current?.nextPage;
    if (nextPage != null) fetchData(nextPage, false);
  }, [inView, hasMore, loading]);

  const fetchData = async (pageNo: number, isRefresh: boolean) => {
    if (loading) return;
    setLoading(true);
    setError('');

    const resultStatus = await api.get(uri, { ...query, pageNo });

    if (!isMounted.current) return;

    if (resultStatus.isError()) {
      setError(resultStatus.getMessage());
      setLoading(false);
      return;
    }

    const dataObj = resultStatus.getData<{ pagingInfo: PagingInfo; data: Post[] }>();
    pagingInfoRef.current = dataObj.pagingInfo;
    setHasMore(dataObj.pagingInfo.nextPage != null);
    setDataArr(prev => (isRefresh ? dataObj.data : [...prev, ...dataObj.data]));
    setLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    pagingInfoRef.current = null;
    setHasMore(true);
    await fetchData(1, true);
    setIsRefreshing(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY > 0) return;
    touchStartY.current = e.touches[0].clientY;
    isPulling.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isPulling.current || isRefreshing) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta < 0) {
      setPullDistance(0);
      return;
    }
    // Prevent the page from scrolling while pulling
    e.preventDefault();
    setPullDistance(Math.min(delta * 0.4, PULL_THRESHOLD * 1.5));
  };

  const onTouchEnd = () => {
    isPulling.current = false;
    if (pullDistance >= PULL_THRESHOLD) {
      handleRefresh();
    }
    setPullDistance(0);
  };

  const pullTriggered = pullDistance >= PULL_THRESHOLD;
  const Renderer = renderer;

  return (
    <div
      ref={containerRef}           // ← add this
      className={className}
      onTouchStart={onTouchStart}
      // onTouchMove={onTouchMove} ← remove this
      onTouchEnd={onTouchEnd}
    >
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

      {dataArr.map((item, idx) => (
        <Renderer key={idx} data={item} {...rendererArgs} />
      ))}

      {error && (
        <div className="text-center py-4 text-red-500">{error}</div>
      )}

      <div ref={sentinelRef} className="py-6 flex justify-center">
        {loading && !isRefreshing && <Spinner size={16} />}
        {!loading && !hasMore && dataArr.length > 0 && (
          <span className="text-sm text-gray-400">No more data</span>
        )}
        {!loading && !hasMore && dataArr.length === 0 && (
          <span className="text-sm text-gray-400">No data found</span>
        )}
      </div>
    </div>
  );
}
