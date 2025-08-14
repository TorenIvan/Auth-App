import { isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { generateCsrfToken } from "../../../helpers";
import { Errors } from "../errors";

const fbLoginUri = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${import.meta.env.VITE_FACEBOOK_APP_ID}&redirect_uri=${import.meta.env.VITE_CLIENT_URI}oauth2/facebook`;

export function facebookInitLoginFlow(): void {
  const csrf_token = generateCsrfToken();
  localStorage.setItem('auth_app_csrf_token', csrf_token);
  window.location.replace(`${fbLoginUri}&state={csrf_token=${csrf_token}}`);
}

export async function retrieveToken(code: string | boolean): Promise<string | void> {
  try {
    if (typeof code === "boolean") return;
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_SERVER_URI}v1/auth/login/facebook`,
      {
        code: code,
      },
      {
        headers
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
