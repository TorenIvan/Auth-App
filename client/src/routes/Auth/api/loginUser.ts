import axios, { AxiosError } from "axios";
import { Errors } from "../errors";

const loginUri = `${import.meta.env.VITE_SERVER_URI}v1/auth/login/credentials`;

export async function loginUser(request: IRequest): Promise<string> {
  const { email, password } = request;
  try {
    const result: IResponse = await axios.post(loginUri, {
      email: email,
      password: password,
    });
    const { access_token } = result;
    return access_token;
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

export interface IResponse {
  access_token: string;
}
