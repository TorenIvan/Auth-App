import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { Errors } from "../errors";

const userEditUri = "v1/profile/edit";

export const userEditQuery = () => ({
  queryKey: ["user", "edit"],
  queryFn: (request: IRequest) => editUserData(request),
});

export async function editUserData(request: IRequest): Promise<void> {
  try {
    console.log("kli8ika: ", request);
    const { username, biography, phone, currentPassword, newPassword } =
      request;

    const result: AxiosResponse<void> = await axiosInstance.put(userEditUri, {
      username: username.trim(),
      biography: biography.trim(),
      phone: phone.trim(),
      currentPassword: currentPassword.trim(),
      newPassword: newPassword.trim(),
    });
    return result.data;
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
  username: string;
  biography: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
}
