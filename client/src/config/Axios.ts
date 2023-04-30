import axios from "axios";
import { globalQueryClient } from "../App";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const data: TAccess_Token = globalQueryClient.getQueryData([
      "access_token",
    ]);

    const token: string = data?.access_token ?? "";
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

type TAccess_Token = { access_token: string | undefined } | undefined;
