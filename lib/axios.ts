import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";

import { ApiResponse } from "@/app/types/auth";
import { env } from "@/env.mjs";
import { clearTokens, getTokens, setTokens } from "@/utils/auth-storage";

// Base API URL
const API_URL = env.NEXT_PUBLIC_API_URL;

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {},
  timeout: 50000,
});

// Track if we're currently refreshing the token
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

// Process the queue of failed requests
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add auth token and handle FormData
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = getTokens();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Transform the response to match our ApiResponse format
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 Unauthorized and we haven't already tried to refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      // Don't try to refresh for login/refresh endpoints
      !originalRequest.url?.includes("/token/") &&
      !originalRequest.url?.includes("/token/refresh/")
    ) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken } = getTokens();

        if (!refreshToken) {
          // No refresh token, clear auth and reject
          clearTokens();
          processQueue(new Error("No refresh token available"));

          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        if (response.data.success && response.data.data) {
          const { token, refreshToken: newRefreshToken } = response.data.data;
          setTokens(token, newRefreshToken);

          // Update Authorization header for the original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          } else {
            originalRequest.headers = { Authorization: `Bearer ${token}` };
          }

          // Process the queue with the new token
          processQueue(null, token);

          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          // Refresh failed, clear auth and reject
          clearTokens();
          processQueue(new Error("Failed to refresh token"));

          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Clear tokens from storage
        clearTokens();

        toast.error("Session expired. Please log in again.");

        // Redirect to login page
        window.location.href = "/auth/login";

        // Reject to stop further processing
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, transform to our ApiResponse format
    const errorResponse: ApiResponse<null> = {
      success: false,
      error:
        (error.response?.data as { error?: string })?.error ||
        "An unexpected error occurred",
    };

    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;
