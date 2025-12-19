import { useCallback } from "react";
import  http from "../core/HttpClient";
import { Status } from "@/core/Status";

/**
 * A simple React hook that exposes helper functions for your API.
 */
export function useApi() {
  
  const get = useCallback(async <T>(path: string, query?: Record<string, any>): Promise<Status> => {
    return http.get(path, query);
  }, []);

  const post = useCallback(async <T>(path: string, body?: unknown, headers?: Record<string, any>): Promise<Status> => {
    return http.post<T>(path, body, headers);
  }, []);

      // meant for using with mutations 
  const getx = async <T>(path: string, query?: Record<string, any>): Promise<T | null> => {
    
    let result = await http.get<T>(path, query);
    
    if(result.isError()){
      throw new Error(result.getMessage() || 'Request failed'); 
    } else {
      return result.getData();
    }
  };

  // meant for using with mutations 
  const postx = async <T>(path: string, body?: unknown, headers?: Record<string, any>): Promise<T> => {
    
    let result = await http.post<T>(path, body, headers);
    
    if(result.isError()){
      throw new Error(result.getMessage() || 'Request failed'); 
    } else {
      return result.getData()
    }
  }

  return { get, post, getx, postx };
}
