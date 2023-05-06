import { AxiosError, isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { Errors } from "../errors";

const userDetailsUri = "v1/auth/check";

export async function checkIfUserIsAuthenticated(): Promise<IResponse> {
  try {
    const result: IResponse = await axiosInstance.get(userDetailsUri);
    return result;
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

interface IResponse {
  success: boolean;
  isAuthed: boolean;
}
