import { AxiosError, isAxiosError } from "axios";
import { axiosInstance } from "../../../config";
import { Errors } from "../errors";
import { toast } from "react-hot-toast";

const confirmBaseUri = "v1/auth/verify";

export const confirmEmailQuery = () => ({
  queryKey: ["confirm", "email"],
  queryFn: async (token: string | null) => confirmUserEmail(token),
});

export async function confirmUserEmail(token: string | null): Promise<boolean> {
  if (!token) {
    toast.error(Errors.NoConfirmationToken);
    throw "error";
  }
  try {
    const confirmUri = `${confirmBaseUri}?token=${token}`;
    await axiosInstance.get(confirmUri);
    return true;
  } catch (error: unknown | AxiosError) {
    if (isAxiosError(error)) {
      const { response } = error;
      const statusCode = response?.status ?? 0;
      const message = response?.data?.message;

      if (statusCode < 500 && message) {
        toast.error(message);
        throw "error";
      }
    }
    toast.error(Errors.GenericError);
    throw "error";
  }
}
