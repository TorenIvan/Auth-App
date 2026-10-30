import axios from 'axios';

const axiosRenewInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 20000,
});
const refreshUri = 'v1/auth/refresh';

/**
 * *** One refresh at a time across all tabs ***
 * Tabs share the refresh token cookie: a second tab waits for the first one and then sends the
 * rotated cookie, instead of reusing the old one at the same time.
 */
export async function renewTokens(): Promise<string> {
  if (!navigator.locks) {
    return requestNewTokens();
  }
  return navigator.locks.request('auth-refresh', () => requestNewTokens());
}

async function requestNewTokens(): Promise<string> {
  try {
    const result = await axiosRenewInstance.post(refreshUri);
    const data = result.data;
    if (data?.access_token === undefined) {
      throw new Error('Access token not found in response');
    }
    return data.access_token;
  } catch (error) {
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.error('Failed to renew tokens');
    }
    throw error;
  }
}
