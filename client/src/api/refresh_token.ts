import { axiosInstance } from "../config";

const refreshUri = "v1/auth/refresh";

export async function renewAccessToken() {
  try {
    const result = await axiosInstance.get(refreshUri);
    const { data } = result;
    if (data?.access_token === undefined) throw "error";
    console.log(
      "i refreshed the token using refresh token. Here is the access: ",
      data?.access_token
    );
    return data?.access_token;
  } catch (e) {
    throw e;
  }
}
