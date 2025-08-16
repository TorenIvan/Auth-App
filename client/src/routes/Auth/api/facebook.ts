import { isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { generateCsrfToken } from "../../../helpers";
import { Errors } from "../errors";

export async function facebookLogin(code: string | boolean): Promise<string | void> {
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

export function facebookInitLoginFlow(): void {
  const csrf_token = generateCsrfToken();
  localStorage.setItem('auth_app_csrf_token', csrf_token);
  const fbLoginUri = `https://www.facebook.com/v23.0/dialog/oauth
    ?client_id=${import.meta.env.VITE_FACEBOOK_APP_ID}
    &redirect_uri=${encodeURIComponent(import.meta.env.VITE_CLIENT_URI + "oauth2/facebook")}
    &state=${encodeURIComponent(csrf_token)}
    `.replace(/\s+/g, ""); 

  window.location.replace(fbLoginUri);
}