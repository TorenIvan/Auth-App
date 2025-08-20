import { isAxiosError } from 'axios';
import { axiosInstance } from '../../../config';
import { generateCsrfToken } from '../../../helpers';
import { Errors } from '../errors';

export async function googleLogin(code: string | boolean): Promise<string | void> {
  try {
    if (typeof code === 'boolean') return;
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_SERVER_URI}v1/auth/login/google`,
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

export function googleInitLoginFlow(): void {
  const csrf_token = generateCsrfToken();
  localStorage.setItem('auth_app_csrf_token', csrf_token);

  const googleLoginUri = `https://accounts.google.com/o/oauth2/v2/auth
    ?client_id=${import.meta.env.VITE_GOOGLE_APP_ID}
    &redirect_uri=${encodeURIComponent(import.meta.env.VITE_CLIENT_URI + 'oauth2/google')}
    &response_type=code
    &scope=email%20profile
    &state=${encodeURIComponent(csrf_token)}
  `.replace(/\s+/g, '');

  window.location.replace(googleLoginUri);
}
