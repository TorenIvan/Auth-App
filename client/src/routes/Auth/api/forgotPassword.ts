import { AxiosResponse, isAxiosError } from 'axios';
import { axiosInstance } from '../../../config';
import { Errors } from '../errors';

const forgotPasswordUri = 'v1/auth/forgot-password';

export async function forgotPassword(email: string): Promise<boolean> {
  try {
    const result: AxiosResponse<void> = await axiosInstance.post(forgotPasswordUri, {
      email: email,
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

      if (statusCode < 500 && message) {
        throw message;
      }
    }
    throw Errors.GenericError;
  }
}
