import { QueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { addAuthorizationHeader, axiosInstance } from "../../../config";
import { Errors } from "../errors";

const logoutUri = "v1/auth/logout";

export async function logoutUser(queryClient?: QueryClient): Promise<void> {
  try {
    await axiosInstance.post(logoutUri);
    addAuthorizationHeader("");
    queryClient?.clear();
  } catch (error: unknown | AxiosError) {
    console.log(error);
    
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
