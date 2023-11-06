import { AxiosResponse, isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { Errors } from "../errors";
import toast from "react-hot-toast";

const userEditUri = "v1/profile/edit";

export const userEditQuery = () => ({
  queryKey: ["user", "edit"],
  queryFn: (request: IRequest) => editUserData(request),
});

export async function editUserData(request: IRequest): Promise<void> {
  try {
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
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const { response } = error;
      const statusCode = response?.status ?? 0;
      const message = response?.data?.message;

      if (statusCode === 401) {
        setTimeout(function() {
          window.location.replace(`${import.meta.env.VITE_CLIENT_URI}login`);
        }, 3000);
        return Promise.reject(error);
      }

      if (statusCode < 500) {
        toast.error(message ?? Errors.GenericError);
        window.location.replace(`${import.meta.env.VITE_CLIENT_URI}login`);
      }
    }
    toast.error(Errors.GenericError);
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
