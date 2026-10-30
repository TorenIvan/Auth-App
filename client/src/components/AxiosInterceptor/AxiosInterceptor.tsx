import { useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import {
  axiosInstance,
  addAuthorizationHeader,
  clearAuthorizationHeader,
  authChannel,
  broadcastAuthEvent,
} from '../../config';
import type { AuthEvent } from '../../config';
import { Errors } from '../../utils';
import { renewTokens } from '../../api';

export function AxiosInterceptor({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    let isRefreshing = false;
    let failedQueue: Array<{
      resolve: (token: string) => void;
      reject: (error: unknown) => void;
    }> = [];

    function processQueue(error: unknown, token: string | null = null) {
      failedQueue.forEach((promise) => {
        if (error) {
          promise.reject(error);
        } else {
          promise.resolve(token!);
        }
      });
      failedQueue = [];
    }

    function endSession() {
      clearAuthorizationHeader();
      queryClient.setQueryData(['auth', 'status'], false);
    }

    const resInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // The failed request keeps its own headers (e.g. multipart); only the token is replaced
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest._retry = true;
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken: string = await renewTokens();
            addAuthorizationHeader(newToken);

            queryClient.setQueryData(['auth', 'status'], true);

            processQueue(null, newToken);

            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);

            /**
             * *** Only the server saying the session is over ends it (401/403) ***
             * Offline, timeouts or 5xx just fail this request; the session is still valid.
             */
            const refreshStatus = isAxiosError(refreshError)
              ? refreshError.response?.status
              : undefined;
            if (refreshStatus === 401 || refreshStatus === 403) {
              endSession();
              toast.error(Errors.SessionExpired);
              broadcastAuthEvent('logout');
            }

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    /**
     * *** Login/logout of another tab: the cookie is shared, the in-memory access token is not ***
     */
    function onAuthEvent(event: MessageEvent<AuthEvent>) {
      if (event.data === 'logout') {
        endSession();
      }
      if (event.data === 'login') {
        queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
      }
    }
    authChannel?.addEventListener('message', onAuthEvent);

    return () => {
      axiosInstance.interceptors.response.eject(resInterceptor);
      authChannel?.removeEventListener('message', onAuthEvent);
    };
  }, [queryClient]);

  return <>{children}</>;
}
