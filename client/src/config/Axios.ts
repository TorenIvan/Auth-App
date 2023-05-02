import axios, { AxiosError } from "axios";
import { renewAccessToken } from "../api";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function addAuthorizationHeader(access_token: string) {
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
  (config) => {
    return config;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response) {
      if (error.response.status === 401 && !!originalConfig._retry === false) {
        originalConfig._retry = true;
        try {
          const access_token = await renewAccessToken();
          if (access_token !== undefined) {
            addAuthorizationHeader(access_token);
          }
          return axiosInstance(originalConfig);
        } catch (_error) {
          if ((_error as AxiosError)?.response?.data) {
            return Promise.reject((_error as AxiosError)?.response?.data);
          }

          return Promise.reject(_error);
        }
      }
      if (
        (error as AxiosError)?.response?.status === 403 &&
        (error as AxiosError)?.response?.data
      ) {
        return Promise.reject((error as AxiosError)?.response?.data);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
