import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { Errors } from "../errors";

const userDetailsUri = "v1/profile/details";

export const userDetailsQuery = () => ({
  queryKey: ["user", "details"],
  queryFn: () => retrieveUserData(),
});

async function retrieveUserData(): Promise<IResponse> {
  try {
    const result: AxiosResponse<IResponse> = await axiosInstance.get(
      userDetailsUri
    );

    return result.data;
  } catch (error: unknown | AxiosError) {
    if (isAxiosError(error)) {
      const statusCode = (error as AxiosError)?.response?.status ?? 0;
      const message = ((error as AxiosError)?.response?.data as any)?.message;

      if (statusCode < 500) {
        throw message ?? Errors.GenericError;
      }
    }
    throw Errors.GenericError;
  }
}

interface IResponse {
  username: string;
  email: string;
  phone: string;
  biography: string;
  signInMethod: string;
  image?: string;
}
