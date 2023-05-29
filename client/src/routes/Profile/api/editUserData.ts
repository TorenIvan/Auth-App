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
    // const { username, biography, phone, currentPassword, newPassword, file } =
    //   request;

    // const formData = new FormData();
    // formData.append("username", username.trim());
    // formData.append("biography", biography.trim());
    // formData.append("phone", phone.trim());
    // formData.append("currentPassword", currentPassword.trim());
    // formData.append("newPassword", newPassword.trim());
    // if (file !== undefined) {
    //   formData.append("file", file);
    // }

    const result: AxiosResponse<void> = await axiosInstance.post(
      userEditUri,
      request,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
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

export interface IRequest {
  username: string;
  biography: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  file?: File;
}
