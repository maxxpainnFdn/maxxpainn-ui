import api from "@/config/api";
import { Status } from "./Status";

interface RequestOptions {
  method?: string;
  body?: any;
  query?: Record<string, string>;
  headers?: Record<string, string>;
}

export default class HttpClient {

  static async request<T>(path: string, options: RequestOptions = {}): Promise<Status<T>> {
    
    
    let url = `${api.endpoint}${path}`;
    const { method = "GET", body, query = {}, headers = {} } = options;

    if(method == "GET" && query && Object.keys(query).length > 0) {
       let q = new URLSearchParams(query)
       url += `?${q}`;
    }

    let contentType = {}
    let _body = body;

    if(method == "POST" && body) {
      if (!(body instanceof FormData)) {
         contentType["Content-Type"] = "application/json"
         _body = JSON.stringify(body)
      }
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...contentType,
          ...headers,
        },
        body: _body,
        credentials: 'include'
      });

      const json = await response.json().catch(() => null);

      // If the server already returns a Status-shaped object
      if (json && json.type && (json.type === "success" || json.type === "error")) {
        return Status.fromJSON<T>(json);
      }

      // If the server just returns data or an unexpected format
      if (response.ok) {
        return Status.success<T>(json as T, "Success");
      }

      return Status.error<T>(
        json?.message || response.statusText || "Unknown error",
        json as T
      );

    } catch (err: any) {
      return Status.error<T>(err.message || "Network error");
    }
  }

  // Convenience methods
  static get<T>(path: string, query: Record<string, string>, headers: Record<string, string> = {}) {
    return this.request<T>(path, { method: "GET", query, headers });
  }

  static post<T>(path: string, body?: any, headers: Record<string, string> = {}) {
    return this.request<T>(path, { method: "POST", body, headers });
  }

  static put<T>(path: string, body?: any, headers: Record<string, string> = {}) {
    return this.request<T>(path, { method: "PUT", body, headers });
  }

  static delete<T>(path: string, headers: Record<string, string> = {}) {
    return this.request<T>(path, { method: "DELETE", headers });
  }
}
