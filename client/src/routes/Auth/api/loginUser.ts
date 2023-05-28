import { AxiosError, isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { Errors } from "../errors";

const loginUri = "v1/auth/login/credentials";

export const loginQuery = () => ({
  queryKey: ["access_token"],
  queryFn: async (request: IRequest) => loginUser(request),
});

export async function loginUser(request: IRequest): Promise<string> {
  const { email, password } = request;
  try {
    const result = await axiosInstance.post(loginUri, {
      email: email,
      password: password,
    });
    const { data } = result;
    if (data?.access_token === undefined) throw "error";
    return data.access_token;
  } catch (error: unknown | AxiosError) {
    if (isAxiosError(error)) {
      const { response } = error;
      const statusCode = response?.status ?? 0;
      const message = response?.data?.message;

      if (statusCode < 500) {
        throw message ?? Errors.GenericError;
      }
    }
    throw Errors.GenericError;
  }
}

interface IRequest {
  email: string;
  password: string;
}
