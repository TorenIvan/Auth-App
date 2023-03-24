import axios from "axios";
import constants from "./constants";
import { Errors } from "../../../utils/Errors";

export async function loginUser(request: IRequest): Promise<string> {
  const { email, password } = request;
  try {
    const result: IResponse = await axios.post(constants.loginUri, {
      email: email,
      password: password,
    });
    const { access_token } = result;
    return access_token;
  } catch (error: unknown) {
    if ((error as any)?.statusCode < 500) {
      throw (error as any)?.message ?? Errors.GenericError;
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
