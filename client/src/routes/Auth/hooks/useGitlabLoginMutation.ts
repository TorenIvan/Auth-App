import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gitlabLogin } from '../api';
import { addAuthorizationHeader } from '../../../config';
import { Errors } from '../../../utils';

export function useGitlabLoginMutation(): UseGitlabLogin {
  const queryClient = useQueryClient();
  const { data, mutate, mutateAsync, isLoading, error, isError } = useMutation({
    mutationFn: (code: string | boolean) => gitlabLogin(code),
    retry: 1,
  });

  useEffect(() => {
    if (data) {
      addAuthorizationHeader(data);
      queryClient.setQueryData(['auth', 'status'], true);
    }
    if (isError) {
      toast.error(typeof error === 'string' ? error : Errors.GenericError);
      if (error === Errors.AUserAlreadyAuthenticated) {
        queryClient.setQueryData(['auth', 'status'], true);
      }
    }
  }, [data, error, queryClient, isError]);

  return {
    data,
    error,
    isError,
    isLoggingInWithGitlab: isLoading,
    mutate,
    mutateAsync,
  } as const;
}

interface UseGitlabLogin {
  data: string | void | undefined;
  error: unknown;
  isError: boolean;
  isLoggingInWithGitlab: boolean;
  mutate: (code: string | boolean) => void;
  mutateAsync: (code: string | boolean) => Promise<string | void>;
}
