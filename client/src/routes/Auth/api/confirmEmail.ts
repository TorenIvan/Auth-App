import { AxiosError, isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { Errors } from "../errors";

const confirmBaseUri = "v1/auth/verify";

export async function confirmEmail(
  email: string,
  token: string
): Promise<boolean> {
  if (!token) {
    throw new AxiosError(Errors.NoConfirmationToken);
  }
  try {
    const confirmUri = `${confirmBaseUri}?email=${email}&token=${token}`;
    await axiosInstance.get(confirmUri);
    return true;
  } catch (error: unknown | AxiosError) {
    if (isAxiosError(error)) {
      const { response } = error;
      const statusCode = response?.status ?? 0;
      const message = response?.data;

      if (statusCode < 500 && message) {
        throw message;
      }
    }
    throw Errors.GenericError;
  }
}
