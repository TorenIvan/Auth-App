import { useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { axiosInstance, addAuthorizationHeader, clearAuthorizationHeader } from '../../config';
import { Errors } from '../../utils';
import { renewTokens } from '../../api';

export function AxiosInterceptor({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    let lastAxiosHeaders = {};
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

    const reqInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        lastAxiosHeaders = { ...config.headers };
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return axiosInstance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken: string = await renewTokens();
            addAuthorizationHeader(newToken);

            queryClient.setQueryData(['auth', 'status'], true);

            processQueue(null, newToken);

            originalRequest.headers = {
              ...lastAxiosHeaders,
              Authorization: `Bearer ${newToken}`,
            };
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            clearAuthorizationHeader();

            queryClient.setQueryData(['auth', 'status'], false);
            toast.error(Errors.SessionExpired);

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [queryClient]);

  return <>{children}</>;
}
