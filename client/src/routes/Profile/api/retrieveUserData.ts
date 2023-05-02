import { AxiosError, isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { Errors } from "../errors";

const userDetailsUri = "v1/profile/details";

export const userDetailsQuery = () => ({
  queryKey: ["user", "details"],
  queryFn: async () => await retrieveUserData(),
});

async function retrieveUserData(): Promise<IResponse> {
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
  username: string;
  email: string;
  phone: string | undefined;
  biography: string | undefined;
  signInMethod: string;
}
