import axios from "axios";
import { toast } from "react-hot-toast";
import { renewTokens } from "../api";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let lastAxiosContentTypeHeader: string | undefined = "application/json";

axiosInstance.interceptors.request.use(
  (config) => {
    lastAxiosContentTypeHeader = config.headers["Content-Type"] as
      | string
      | undefined;
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
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const access_token = await renewTokens();
          const authorizationHeader = addAuthorizationHeader(access_token);

          originalRequest.headers["Authorization"] = authorizationHeader;
          originalRequest.headers["Content-Type"] = lastAxiosContentTypeHeader;
          return axiosInstance(originalRequest);
        } catch (err) {
          toast.error("Session not exists or expired. Redirecting to login...");
          setTimeout(function() {
            const isAlreadyInPublicRoute: boolean = publicRoutes.some(element => window.location.href.indexOf(element) > -1);
            if (isAlreadyInPublicRoute === false) {
              window.location.replace(`${import.meta.env.VITE_CLIENT_URI}login`);
              return Promise.reject(error);
            }
          }, 3000);
        }
      } else {
        // Refresh token request has already been attempted
        toast.error("Session not exists or expired. Redirecting to login...");
        setTimeout(function() {
          const isAlreadyInPublicRoute: boolean = publicRoutes.some(element => window.location.href.indexOf(element) > -1);
          if (isAlreadyInPublicRoute === false) {
            window.location.replace(`${import.meta.env.VITE_CLIENT_URI}login`);
            return Promise.reject(error);
          }
        }, 3000);
      }
    }

    // Handle non-authentication errors
    return Promise.reject(error);
  }
);

export default axiosInstance;

export function addAuthorizationHeader(access_token: string) {
  const isTokenInvalid: boolean =
    access_token === null ||
    access_token === undefined ||
    typeof access_token !== "string";

  if (isTokenInvalid === true) {
    throw new Error("Invalid access token");
  }
  const authorizationHeader = `Bearer ${access_token}`;
  axiosInstance.defaults.headers["Authorization"] = authorizationHeader;
  return authorizationHeader;
}

const publicRoutes = [
  "login",
  "register",
  "verify",
  "forgot-password",
  "reset-password",
  "oauth2"
] as const;
