import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gitlabLogin } from '../api';
import { addAuthorizationHeader, broadcastAuthEvent } from '../../../config';
import { Errors } from '../../../utils';

export function useGitlabLoginMutation(): UseGitlabLogin {
  const queryClient = useQueryClient();
  const { data, mutate, mutateAsync, isPending, error, isError } = useMutation({
    mutationFn: (code: string | boolean) => gitlabLogin(code),
  });

  useEffect(() => {
    if (data) {
      addAuthorizationHeader(data);
      queryClient.setQueryData(['auth', 'status'], true);
      broadcastAuthEvent('login');
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
    isLoggingInWithGitlab: isPending,
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
