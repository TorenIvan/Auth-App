import { QueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { addAuthorizationHeader, axiosInstance } from "../../../config";
import { Errors } from "../errors";

const logoutUri = "v1/auth/logout";

export async function logout(queryClient?: QueryClient): Promise<void> {
  try {
    await axiosInstance.post(logoutUri);
    addAuthorizationHeader("");
    queryClient?.clear();
    window.location.replace(`${import.meta.env.VITE_CLIENT_URI}login`);
  } catch (error: unknown | AxiosError) {
    if (isAxiosError(error)) {
      const statusCode = (error as AxiosError)?.response?.status ?? 0;
      const message = ((error as AxiosError)?.response?.data as any)?.message;

      if (statusCode < 500) {
        throw message ?? Errors.GenericError;
      }
      throw Errors.GenericError;
    }
    throw Errors.GenericError;
  }
}
