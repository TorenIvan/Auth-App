import axios from "axios";
import { renewTokens } from "../api";

let isRefreshing = false;
let failedQueue: Array<(() => void) | null> = [];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function addAuthorizationHeader(access_token: string) {
  const isTokenInvalid: boolean =
    access_token === null ||
    access_token === undefined ||
    typeof access_token !== "string";

  if (isTokenInvalid === true) {
    throw new Error("Invalid access token");
  }
  axiosInstance.defaults.headers["Authorization"] = `Bearer ${access_token}`;
}

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401) {
      if (isRefreshing === false) {
        isRefreshing = true;

        try {
          const access_token = await renewTokens();
          addAuthorizationHeader(access_token);

          // Resend original request
          failedQueue?.forEach((promise) => promise && promise());
          failedQueue = [];

          return axiosInstance(originalRequest);
        } catch (err) {
          // For example, logout user
          window.location.replace(`${import.meta.env.VITE_CLIENT_URI}login`);
        } finally {
          isRefreshing = false;
        }
      }

      // Add original request to failedQueue
      return new Promise((resolve) => {
        failedQueue?.push(() => resolve(axiosInstance(originalRequest)));
      });
    }

    // Handle non-authentication errors
    if (error?.response?.status === 403) {
      const errorMessage = error?.response?.data;
      return Promise.reject(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
