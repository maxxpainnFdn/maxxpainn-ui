
export interface ApiConfig  {
    endpoint: string
}

const env = import.meta.env;

const api: ApiConfig = {
    endpoint: env.VITE_API_ENDPOINT || "https://api.maxxpainn.com"
}

export default api;
