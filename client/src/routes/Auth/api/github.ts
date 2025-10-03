import { isAxiosError } from 'axios';
import { axiosInstance } from '../../../config';
import { generateCsrfToken } from '../../../helpers';
import { Errors } from '../../../utils';

export async function githubLogin(code: string | boolean): Promise<string | void> {
  try {
    if (typeof code === 'boolean') return;
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_SERVER_URI}v1/auth/login/github`,
      {
        code: code,
      },
      {
        headers,
      }
    );
    return response.data.access_token;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const { response } = error;
      const statusCode = response?.status ?? 0;
      const message = response?.data;

      if (statusCode === 403) {
        throw Errors.AUserAlreadyAuthenticated;
      }
      if (statusCode < 500 && message) {
        throw message;
      }
    }
    throw Errors.GenericError;
  }
}

export function githubInitLoginFlow(): void {
  const csrf_token = generateCsrfToken();
  localStorage.setItem('auth_app_csrf_token', csrf_token);
  const githubLoginUri = `https://github.com/login/oauth/authorize
    ?client_id=${import.meta.env.VITE_GITHUB_APP_ID}
    &redirect_uri=${encodeURIComponent(import.meta.env.VITE_CLIENT_URI + 'oauth2/github')}
    &state=${encodeURIComponent(csrf_token)}
    &scope=read:user%20user:email
    `.replace(/\s+/g, '');

  window.location.replace(githubLoginUri);
}
