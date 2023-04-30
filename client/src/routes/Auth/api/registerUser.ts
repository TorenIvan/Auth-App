import axios, { AxiosError } from "axios";
import { Errors } from "../errors";

const registerUri = `${
  import.meta.env.VITE_SERVER_URI
}v1/auth/register/credentials`;

export async function registerUser(request: IRequest): Promise<void> {
  const { email, password } = request;
  try {
    await axios.post(registerUri, {
      email: email,
      password: password,
    });
  } catch (error: unknown | AxiosError) {
    if (axios.isAxiosError(error)) {
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

export interface IRequest {
  email: string;
  password: string;
}
