import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Errors } from '../utils';
import { userAuthQuery } from '../api';

export function useCheckIfUserIsAuthenticatedQuery() {
  const { data, isFetching, isError, error, refetch } = useQuery(userAuthQuery);

  useEffect(() => {
    if (isError) {
      if (typeof error === 'string' || error instanceof String) {
        toast.error(error as string);
      } else {
        toast.error(Errors.GenericError);
      }
    }
  }, [isError, error]);

  return {
    isAuthenticated: data,
    isAuthenticating: isFetching,
    isErrorAuth: isError,
    errorAuth: error,
    refetchAuth: refetch,
  } as const;
}
