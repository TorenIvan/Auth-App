import axios from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

let lastAxiosContentTypeHeader: string | undefined = "application/json";

// Token renewal state management
let isRenewing = false;
let missedRequestsForPendingRenewalQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

// AuthContext reference - will be set by setupAxiosInterceptors
let authContextRef: {
  refreshTokens: () => Promise<string>;
  logout: () => Promise<void>;
} | null = null;

axiosInstance.interceptors.request.use(
  (config) => {
    lastAxiosContentTypeHeader = config.headers["Content-Type"] as string | undefined;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If token renewal is already in progress, queue this request
      if (isRenewing) {
        return new Promise((resolve, reject) => {
          missedRequestsForPendingRenewalQueue.push({ resolve, reject });
        })
          .then((token: unknown) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest.headers["Content-Type"] = lastAxiosContentTypeHeader;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      try {
        isRenewing = true;
        
        if (!authContextRef) {
          throw new Error("Auth context not available");
        }

        const accessToken = await authContextRef.refreshTokens();
        
        // Process all queued requests with new token
        processQueue(accessToken, null);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers["Content-Type"] = lastAxiosContentTypeHeader;
        addAuthorizationHeader(accessToken);
        
        return axiosInstance(originalRequest);
      } catch (renewError) {
        // Process queued requests with error
        processQueue(null, renewError);
        
        // Handle authentication failure
        toast.error("Session expired. Please login again.");
        await handleAuthFailure();
        return Promise.reject(renewError);
      } finally {
        isRenewing = false;
      }
    }

    // Second 401 after retry - session definitely expired
    if (error?.response?.status === 401 && originalRequest._retry) {
      toast.error("Session expired. Please login again.");
      await handleAuthFailure();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

/**
 * @description Receives the refreshed access token and re-runs all the failed (pending) requests with this new access token at their header.
 * If an error occurs, it means that the user is no longer authenticated; thus it rejects all failed "pending" request promises.
 * @param {string | null} token Access token retrieved from renewal.
 * @param {unknown} error Error from renewal.
 */
function processQueue(token: string | null, error: unknown) {
  missedRequestsForPendingRenewalQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  missedRequestsForPendingRenewalQueue = [];
}

async function handleAuthFailure() {
  if (authContextRef) {
    await authContextRef.logout();
  }
}

/**
 * Setup function to connect AuthContext with axios interceptors
 */
export function setupAxiosInterceptors(authContext: {
  refreshTokens: () => Promise<string>;
  logout: () => Promise<void>;
}) {
  authContextRef = authContext;
}

export default axiosInstance;

export function addAuthorizationHeader(accessToken: string): void {
  if (
    accessToken === null ||
    accessToken === undefined ||
    typeof accessToken !== "string"
  ) {
    throw new Error("Invalid access token");
  }

  axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
}