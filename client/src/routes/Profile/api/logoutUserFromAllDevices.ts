import { AxiosError, isAxiosError } from 'axios';
import { axiosInstance } from '../../../config';
import { Errors } from '../../../utils';

const logoutAllUri = 'v1/auth/logout-all';

export async function logoutUserFromAllDevices(): Promise<void> {
  try {
    await axiosInstance.post(logoutAllUri);
  } catch (error: unknown | AxiosError) {
    if (isAxiosError(error)) {
      const statusCode = (error as AxiosError)?.response?.status ?? 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = ((error as AxiosError)?.response?.data as any)?.message;

      if (statusCode < 500) {
        throw message ?? Errors.GenericError;
      }
      throw Errors.GenericError;
    }
    throw Errors.GenericError;
  }
}
