import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useApi } from "./useApi";

export function useApiQuery<T>(
  uri: string,
  query: Record<string, any> = {},
  pageNo?: number,
  cacheTTL: number = 1000 * 60 * 5
) {
  const queryClient = useQueryClient();
  const api = useApi();
  const clearedRef = useRef(false);

  const queryKey = ["api", uri, JSON.stringify(query), pageNo];

  const queryResult = useQuery<T>({
    queryKey,

    queryFn: async () => {
      const res = await api.get(uri, {
        ...query,
        pageNo,
      });

      if (res.isError()) {
        throw new Error(res.getMessage());
      }

      const data = res.getData();
      
      console.log("data===>", data)

      if (data == null) {
        clearCache()
      }

      return data;
    },

    staleTime: cacheTTL,
    gcTime: 1000 * 60 * 30,

    placeholderData: (prev) => prev,

    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
  
  
  const clearCache = () => {
    if (queryResult.error && !clearedRef.current) {
      clearedRef.current = true;

      queryClient.cancelQueries({ queryKey: ["api", uri] });

      queryClient.removeQueries({
        queryKey: ["api", uri],
      });
    }
  }

  // ✅ SAFE cache clearing
  useEffect(() => {
    clearCache()
  }, [queryResult.error]);

  return queryResult;
}
