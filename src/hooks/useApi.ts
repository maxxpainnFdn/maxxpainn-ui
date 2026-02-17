import  http from "../core/HttpClient";
import { Status } from "@/core/Status";
import useAuth from "./useAuth";

/**
 * A simple React hook that exposes helper functions for your API.
 */
export function useApi() {

  const { isAuthenticated, getAccessToken } = useAuth()

  const getWithAuth =  async (path: string, query?: Record<string, any>): Promise<Status> => {

    if(!isAuthenticated){
      return Status.error("login required")
    }

    //lets check if the access token has expired, then we will referesh
    const accessTokenStatus = await getAccessToken()
    
    if (!accessTokenStatus) {
      return Status.error("login required")
    }

    if(accessTokenStatus.isError()){
      return accessTokenStatus
    }

    const accessToken = accessTokenStatus.getData() as string;

    const headers = { "Authorization": `Bearer ${accessToken}`,}

    return http.get(path, query, headers);
  }

  const postWithAuth = async (path: string, body?: unknown, headers?: Record<string, any>): Promise<Status> => {

    if(!isAuthenticated){
      return Status.error("login required")
    }

    //lets check if the access token has expired, then we will referesh
    const accessTokenStatus = await getAccessToken()

    if(accessTokenStatus.isError()){
      return accessTokenStatus
    }

    const accessToken = accessTokenStatus.getData() as string;

    const _headers = { "Authorization": `Bearer ${accessToken}`,}

    headers = (headers && Object.keys(headers).length > 0) ? { ...headers, ..._headers } : _headers;

    return http.post(path, body, headers);
  }

  const get = async (path: string, query?: Record<string, any>): Promise<Status> => {

    if(isAuthenticated){
      return getWithAuth(path, query)
    } else {
      return http.get(path, query);
    }
  }

  const post = async (path: string, body?: unknown, headers?: Record<string, any>): Promise<Status> => {

    if(isAuthenticated){
      return postWithAuth(path, body, headers)
    } else {
      return http.post(path, body, headers);
    }
  }


  return { get, post, getWithAuth, postWithAuth };
}
