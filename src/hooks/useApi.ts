import  http from "../core/HttpClient";
import { Status } from "@/core/Status";
//import useAuth from "./useAuth";

/**
 * A simple React hook that exposes helper functions for your API.
 */
export function useApi() {

  //const { isAuthenticated, getAccessToken } = useAuth()

  const get = async (path: string, query?: Record<string, any>): Promise<Status> => {
    return http.get(path, query);
  }

  const post = async (path: string, body?: unknown, headers?: Record<string, any>): Promise<Status> => {
    return http.post(path, body, headers);
  }

  /*
  const getWithAuth =  async (path: string, query?: Record<string, any>): Promise<Status> => {
    if(!isAuthenticated){
      return Status.error("login required")
    }

    //lets check if the access token has expired, then we will referesh
    //const accessToken =
  }
  */

  return { get, post };
}
