import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { broadcastAuthEvent, clearAuthorizationHeader } from '../../../config';
import { Errors } from '../../../utils';
import { logoutUserFromAllDevices } from '../../Profile/api';

/**
 * *** Every session of the user is revoked; other devices are logged out on their next refresh ***
 */
export function useLogoutAllMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isError } = useMutation({ mutationFn: logoutUserFromAllDevices });

  const logoutAll = useCallback(async () => {
    try {
      await mutateAsync();
      clearAuthorizationHeader();
      await queryClient.cancelQueries();
      queryClient.setQueryData(['auth', 'status'], false);
      broadcastAuthEvent('logout');
    } catch (localError) {
      if (typeof localError === 'string' || localError instanceof String) {
        toast.error(localError as string);
      } else {
        toast.error(Errors.GenericError);
      }
    }
  }, []);

  return {
    logoutAll,
    isLoggingOutAll: isPending,
    isErrorLogoutAll: isError,
  } as const;
}
