import { AxiosResponse, isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { Errors } from "../errors";

const userEditUri = "v1/user/edit";

export async function editUserData(formData: FormData): Promise<void> {
  try {
    const result: AxiosResponse<void> = await axiosInstance.post(
      userEditUri,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return result.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const { response } = error;
      const statusCode = response?.status ?? 0;
      const message = response?.data;

      if (statusCode < 500 && message) {
        throw (message ?? Errors.GenericError);
      }
    }
    throw Errors.GenericError;
  }
}

export interface IRequest {
  username: string;
  biography: string;
  phone: string;
  currentPassword?: string;
  newPassword?: string;
  file?: File;
}
