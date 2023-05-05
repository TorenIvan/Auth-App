import axios from "axios";
import { redirect } from "react-router-dom";
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
  console.log("access_token is: ", access_token);
  const isTokenInvalid: boolean =
    access_token === null ||
    access_token === undefined ||
    typeof access_token !== "string";

  if (isTokenInvalid === true) {
    throw new Error("Invalid access token");
  }
  axiosInstance.defaults.headers["Authorization"] = `Bearer ${access_token}`;
  console.log("axios: ", axiosInstance.defaults.headers["Authorization"]);
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
    console.log("Iparxei periptosi na eskases pou8ena");
    const originalRequest = error.config;

    if (error?.response?.status === 401) {
      if (isRefreshing === false) {
        isRefreshing = true;

        try {
          const access_token = await renewTokens();
          console.log("Kati pige la8os meta to renew");
          addAuthorizationHeader(access_token);

          // Resend original request
          failedQueue?.forEach((promise) => promise && promise());
          failedQueue = [];

          return axiosInstance(originalRequest);
        } catch (err) {
          // Handle token renewal error
          // For example, logout user
          console.log("Se epiase ertror?");
          //return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
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

    console.log("Se epiase ertror?");
    return Promise.reject(error);
  }
);

export default axiosInstance;
