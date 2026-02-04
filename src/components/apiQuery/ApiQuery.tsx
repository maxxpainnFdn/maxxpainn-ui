import { ReactNode, useEffect, useState } from "react";
import LoadingView from "../loadingView/LoadingView";
import ErrorView from "../errorView/ErrorView";
import { useApi } from "@/hooks/useApi";
import { Pagination, SimplePagination } from "../pagination/Pagination";

export type PagingType = "simple" | "full";

export interface ApiQueryProps {
    uri: string;
    query?: Record<string, any>;
    children?: ReactNode;
    onSuccess?: <T>(data: T | null) => void;
    onError?: (message: string) => void;
    showError?: boolean;
    pagingType?: PagingType;
    pagingProps?: Record<string, any>;
    loaderPorps?: Record<string, any>;
    errorProps?: Record<string, any>;
}

export default function ApiQuery({
    uri,
    query = {},
    children= <></>,
    onSuccess = ((data: any, pagingInfo?: any)=>{}),
    onError = ((msg:string)=>{}),
    showError = true,
    pagingType = "full",
    pagingProps = {},
    loaderProps = {},
    errorProps = {}
}) {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [pagingInfo, setPagingInfo] = useState(null)

    const api = useApi()

    useEffect(() => { fetchData()  }, [uri])

    const fetchData = async (pageNo?: number) => {

        setError("")
        setLoading(true)

        if(pageNo) {
            query = query || {}
            query[pageNo] = pageNo
        }

        const resultStatus = await api.get(uri, query)

       // console.log("resultStatus==>",resultStatus)

        setLoading(false)

        if(resultStatus.isError()) {
            const err = resultStatus.getMessage()
            if(onError) onError(err)
            setError(err)
            return;
        }

        let resultData: any = resultStatus.getData();

        let isObj = (typeof resultData == 'object')

        if(!isObj || (isObj && !('pagingInfo' in resultData)) ) {
            onSuccess(resultData)
            return;
        }

        const { data, pagingInfo } = resultData;

        setPagingInfo(pagingInfo)
        onSuccess(data, pagingInfo)

    }

    const onPageChange = (pageNo) => {
        fetchData(pageNo)
    }

    const onReload = () => {
        if(pagingInfo) {
            return fetchData(pagingInfo.currentPage)
        } else {
            fetchData()
        }
    }

    return (
        <LoadingView loading={loading} {...loaderProps}>
            { error != "" ?
                <>{ showError && <ErrorView text={error} onReload={onReload} {...errorProps} /> }</>:
                <>
                    { children }
                    { pagingInfo != null && pagingType && pagingInfo.pageCount > 1 &&
                        <div className="mt-5">
                            { pagingType == "simple" ?
                                <SimplePagination
                                    currentPage={pagingInfo.currentPage}
                                    totalPages={pagingInfo.totalCount}
                                    onPageChange={onPageChange}
                                    {...pagingProps}
                                /> :
                                <Pagination
                                    currentPage={pagingInfo.currentPage}
                                    totalPages={pagingInfo.totalCount}
                                    onPageChange={onPageChange}
                                    {...pagingProps}
                                />
                            }
                        </div>
                    }
                </>
            }
        </LoadingView>
    )
}
