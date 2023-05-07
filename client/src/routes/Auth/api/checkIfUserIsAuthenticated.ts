import { AxiosError, isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { Errors } from "../errors";

const uri = "v1/auth/check";

export async function checkIfUserIsAuthenticated(): Promise<boolean> {
  try {
    await axiosInstance.get(uri);
    return true;
  } catch (error: unknown | AxiosError) {
    if (isAxiosError(error)) {
      const statusCode = (error as AxiosError)?.response?.status ?? 0;
      if (statusCode === 403) {
        return false;
      }
      throw Errors.GenericError;
    }
    throw Errors.GenericError;
  }
}
