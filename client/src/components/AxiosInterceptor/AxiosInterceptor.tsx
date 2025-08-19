import { useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { axiosInstance, addAuthorizationHeader, clearAuthorizationHeader } from '../../config';
import { Errors } from '../../utils';
import { renewTokens } from '../../api';

export function AxiosInterceptor({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    let isRefreshing = false;
    let missedRequestsForPendingRenewalQueue: Array<{
      resolve: (token: string) => void;
      reject: (error: unknown) => void;
    }> = [];

    function processQueue(error: unknown, token: string | null = null) {
      missedRequestsForPendingRenewalQueue.forEach(promise => {
        if (error) {
          promise.reject(error);
        } else {
          promise.resolve(token!);
        }
      });
      missedRequestsForPendingRenewalQueue = [];
    }

    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              missedRequestsForPendingRenewalQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            }).catch(err => Promise.reject(err));
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
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [queryClient]);

  return <>{children}</>;
}