import { AxiosResponse, isAxiosError } from 'axios';
import { axiosInstance } from '../../../config';
import { Errors } from '../../../utils';

const resetPasswordBaseUri = 'v1/auth/reset-password';

export async function resetPassword(
  email: string,
  token: string,
  password: string,
  confirmPassword: string
): Promise<boolean> {
  try {
    const resetPasswordUri = `${resetPasswordBaseUri}?email=${email}&token=${token}`;
    const result: AxiosResponse<void> = await axiosInstance.post(resetPasswordUri, {
      newPassword: password,
      confirmNewPassword: confirmPassword,
    });
    const statusCode: number = result.status;
    if (statusCode === 200) {
      return true;
    }
    return false;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const { response } = error;
      const statusCode = response?.status ?? 0;
      const message = response?.data;

      if (statusCode === 403 && message) {
        throw { isForbidden: true, message: message };
      }

      if (statusCode < 500 && message) {
        throw message;
      }
    }
    throw Errors.GenericError;
  }
}
