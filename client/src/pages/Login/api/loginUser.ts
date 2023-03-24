import axios from "axios";
import constants from "./constants";

export async function loginUser(request: IRequest): Promise<string> {
  const { email, password } = request;
  try {
    console.log("request");

    const result: IResponse = await axios.post(constants.loginUri, {
      email: email,
      password: password,
    });

    const { access_token } = result;
    return access_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export interface IRequest {
  email: string;
  password: string;
}

export interface IResponse {
  access_token: string;
}
