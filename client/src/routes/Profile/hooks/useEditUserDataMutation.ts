import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Errors, Constants } from '../../../utils';
import { editUserData, userDetailsQuery } from '../api';

export function useEditUserDataMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: editUserData,
  });

  useEffect(() => {
    if (isError) {
      if (typeof error === 'string' || error instanceof String) {
        toast.error(error as string);
      } else {
        toast.error(Errors.GenericError);
      }
    }
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: userDetailsQuery.queryKey });
      toast.success(Constants.ProfileUpdatedSuccess);
      navigate('/profile');
    }
  }, [isError, isSuccess, error]);

  return {
    editUser: mutateAsync,
    isMutating: isPending,
    isError,
    isSuccess,
    error,
  } as const;
}
