import axios from "axios";

/**
 * New instance; because if a new request was made using the same axiosInstance with the same interceptors
 * it will trigger the same interceptors causing infinite loop
 */
const axiosRenewInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
const refreshUri = "v1/auth/refresh";

export async function renewTokens(): Promise<string> {
  try {
    const result = await axiosRenewInstance.get(refreshUri);
    const data = result.data;
    if (data?.access_token === undefined) {
      throw new Error("Access token not found in response");
    }
    return data.access_token;
  } catch (error) {
    throw new Error("Failed to renew access token");
  }
}
