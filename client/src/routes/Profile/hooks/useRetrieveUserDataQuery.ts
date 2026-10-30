import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { Errors } from '../../../utils';
import { userDetailsQuery } from '../api';

export function useRetrieveUserDataQuery() {
  const { data, isFetching, isError, error } = useQuery(userDetailsQuery);

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
    userInfo: data,
    isFetching,
    isError,
    error,
  } as const;
}
