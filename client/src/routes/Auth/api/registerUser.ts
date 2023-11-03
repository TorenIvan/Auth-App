import axios, { isAxiosError } from "axios";
import { Errors } from "../errors";

const registerUri = `${import.meta.env.VITE_SERVER_URI
  }v1/auth/register/credentials`;

export async function registerUser(request: IRequest): Promise<void> {
  const { email, password } = request;
  try {
    await axios.post(registerUri, {
      email: email,
      password: password,
    });
    return;
  } catch (error: unknown) {
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

export interface IRequest {
  email: string;
  password: string;
}
