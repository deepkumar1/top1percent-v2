import axios from "axios";

const TOKEN_KEY = "auth_token";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

type LogoutHandler = () => void;
let onUnauthorized: LogoutHandler | null = null;

export function registerUnauthorizedHandler(handler: LogoutHandler) {
  onUnauthorized = handler;
}

export function unregisterUnauthorizedHandler() {
  onUnauthorized = null;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
