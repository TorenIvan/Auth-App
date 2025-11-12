import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 20000,
});

export function addAuthorizationHeader(accessToken: string): void {
  if (accessToken === null || accessToken === undefined || typeof accessToken !== 'string') {
    throw new Error('Invalid access token');
  }
  axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
}

export function clearAuthorizationHeader(): void {
  delete axiosInstance.defaults.headers.Authorization;
}
