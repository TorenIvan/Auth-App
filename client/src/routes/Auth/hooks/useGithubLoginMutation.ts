import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { githubLogin } from '../api';
import { addAuthorizationHeader } from '../../../config';
import { Errors } from '../errors';

export function useGithubLoginMutation(): UseGithubLogin {
  const queryClient = useQueryClient();
  const { data, mutate, mutateAsync, isLoading, error, isError } = useMutation({
    mutationFn: (code: string | boolean) => githubLogin(code),
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
    data: data,
    error: error,
    isError,
    isLoggingInWithGithub: isLoading,
    mutate: mutate,
    mutateAsync: mutateAsync,
  } as const;
}

interface UseGithubLogin {
  data: string | void | undefined;
  error: unknown;
  isError: boolean;
  isLoggingInWithGithub: boolean;
  mutate: (code: string | boolean) => void;
  mutateAsync: (code: string | boolean) => Promise<string | void>;
}
