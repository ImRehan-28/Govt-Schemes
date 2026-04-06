import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL /*|| "http://localhost:8080"*/;

console.log("[API] Base URL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log(`[API] Response ${res.status} from ${res.config.url}`);
    return res;
  },
  (err) => {
    console.error(`[API] Error ${err?.response?.status} from ${err?.config?.url}:`, err?.message);
    return Promise.reject(err);
  }
);

export default api;
