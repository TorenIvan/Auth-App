import { isAxiosError } from 'axios';
import { axiosInstance } from '../../../config';
import { generateCsrfToken } from '../../../helpers';
import { Errors } from '../errors';

export async function gitlabLogin(code: string | boolean): Promise<string | void> {
  try {
    if (typeof code === 'boolean') return;
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_SERVER_URI}v1/auth/login/gitlab`,
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

export function gitlabInitLoginFlow(): void {
  const csrf_token = generateCsrfToken();
  localStorage.setItem('auth_app_csrf_token', csrf_token);
  const gitlabLoginUri = `https://gitlab.com/oauth/authorize
    ?client_id=${import.meta.env.VITE_GITLAB_APP_ID}
    &redirect_uri=${encodeURIComponent(import.meta.env.VITE_CLIENT_URI + 'oauth2/gitlab')}
    &response_type=code
    &state=${encodeURIComponent(csrf_token)}
    &scope=read_user%20email
    `.replace(/\s+/g, '');

  window.location.replace(gitlabLoginUri);
}
