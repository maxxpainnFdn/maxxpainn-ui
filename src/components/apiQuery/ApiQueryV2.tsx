import { ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingView from "../loadingView/LoadingView";
import ErrorView from "../errorView/ErrorView";
import { useApi } from "@/hooks/useApi";
import { Pagination, SimplePagination } from "../pagination/Pagination";
import { keepPreviousData,  } from "@tanstack/react-query";
import { useApiQueryFetch } from "@/hooks/useApiQueryFetch";
import { useApiQuery } from "@/hooks/useApiQuery";

export type PagingType = "simple" | "full";

export interface PagingInfo {
  currentPage: number;
  pageCount: number;
}

export interface ApiResponse<T> {
  data: T;
  pagingInfo?: PagingInfo;
}

export interface ApiQueryProps<T> {
  uri: string;
  query?: Record<string, any>;
  children?: (data: T, pagingInfo?: PagingInfo) => ReactNode;
  onError?: (message: string) => void;
  showError?: boolean;
  pagingType?: PagingType;
  pagingProps?: Record<string, any>;
  loaderProps?: Record<string, any>;
  errorProps?: Record<string, any>;
  cacheTTL?: number;
}

export default function ApiQueryV2<T = any>({
  uri,
  query = {},
  children=null,
  //onSuccess,
  onError,
  showError = true,
  pagingType = "full",
  pagingProps = {},
  loaderProps = {},
  errorProps = {},
  cacheTTL = 1000 * 60 * 5
}: ApiQueryProps<T>) {
  
  const [pageNo, setPageNo] = useState<number>(1);

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useApiQuery(uri, query, pageNo, cacheTTL)

  // handle error callback
  if (error) {
    onError?.(error.message);

    if (showError) {
      return (
        <ErrorView
          text={error.message}
          onReload={refetch}
          {...errorProps}
        />
      );
    }
  }
  
  // loading state (first load only)
  if (isLoading) {
    return <LoadingView loading {...loaderProps} />;
  }
  
  let resultData: any = data as any;
  let pagingInfo: PagingInfo | null = null;
  let actualData: T | null = null;
  
  
  if ("pagingInfo" in resultData) {
    pagingInfo = resultData.pagingInfo;
    actualData = resultData?.data ?? null;
  } else {
    actualData = resultData as T;
  }

  //console.log("actualData==>", actualData)
  
  return (
    <>
      {children?.(actualData, pagingInfo)}

      {pagingInfo && pagingInfo.pageCount > 1 && (
        <div className="mt-5">
          {pagingType === "simple" ? (
            <SimplePagination
              currentPage={pagingInfo.currentPage}
              totalPages={pagingInfo.pageCount}
              onPageChange={setPageNo}
              {...pagingProps}
            />
          ) : (
            <Pagination
              currentPage={pagingInfo.currentPage}
              totalPages={pagingInfo.pageCount}
              onPageChange={setPageNo}
              {...pagingProps}
            />
          )}
        </div>
      )}
    </>
  );
}
