
import { useEffect, useMemo, useState } from 'react';
import InfiniteScrollComponent from 'react-infinite-scroll-component';
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

export default function InfiniteScroll({
  uri,
  query = {},
  renderer,
  rendererArgs = {},
  className = ""
}: InfiniteScrollProps ) {
  
  const api = useApi()
  
  const [dataArr, setDataArr] = useState([])
  const [pagingInfo, setPagingInfo] = useState<PagingInfo | null>(null)
  const [loadingError, setLoadingError] = useState<string>("")
  
  useEffect(() => {
    setDataArr([])
    fetchData(1, false)
  }, [])
  
  const hasMore = useMemo(() => (!pagingInfo) ? true : pagingInfo.currentPage < pagingInfo.lastPage, [pagingInfo])
  
  const fetchData = async (pageNo: number = 1, isRefresh: boolean = false) => {
    
    //console.log("pageNo===>", pageNo)
    
    if (pagingInfo != null && pageNo > pagingInfo.lastPage) {
      pageNo = pagingInfo.lastPage;
    }
        
    const resultStatus = await api.get(uri, {
      ...query,
      pageNo
    })
    
    //console.log("resultStatus==>", resultStatus)
    
    if (resultStatus.isError()) {
      setLoadingError(resultStatus.getMessage())
      return;
    }
    
    const dataObj = resultStatus.getData<{ pagingInfo: PagingInfo, data: Post[]}>()
    
    if (isRefresh) {
      setDataArr(dataObj.data)
    } else {
      setDataArr((prev) => ([...prev, ...dataObj.data]))
    }
    
    setPagingInfo(dataObj.pagingInfo)
    
    ///console.log("resultStatus===>", resultStatus) 
  }
  
  
  const fetchNext = () => {
    const nextPage = (pagingInfo)
      ? Math.min(pagingInfo.currentPage + 1, pagingInfo.lastPage)
      : 1
    
    ///console.log("nextPage==>", nextPage)
    fetchData(nextPage, false)
  }
  
  const doRefresh = () => {
    fetchData(1, true)
  }
    
  const endMessage = (<div className='flex text-center'>No Data</div>)
  const loader = (<Spinner size={16} className="overflow-none m-5" />)
  
  const pullDownToRefreshContent = (
    <div className="bg-maxx-bg0/20 text-center p-2">Pull down to refresh</div>
  )
  
  const releaseToRefreshContent = (
    <div className="bg-maxx-bg0/20 text-center p-2">Release to refresh</div>
  )
  
  const Renderer = renderer;
  
  return (
    <InfiniteScrollComponent
      dataLength={dataArr.length} //This is important field to render the next data
      next={fetchNext}
      hasMore={hasMore}
      loader={loader}
      endMessage={endMessage}
      refreshFunction={doRefresh}
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
      pullDownToRefreshContent={pullDownToRefreshContent}
      releaseToRefreshContent={releaseToRefreshContent}
      className={className}
    >
      {dataArr.map((item, idx) => (
        <Renderer 
          key={idx}
          data={item}
          {...rendererArgs}
        />
      ))}
    </InfiniteScrollComponent>
  )
}
