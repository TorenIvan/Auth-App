import { useMutation } from '@tanstack/react-query';
import { renewTokens } from '../api';

export function useRenewTokensMutation() {
  const { mutateAsync, isLoading, isError, error } = useMutation(renewTokens);

  return {
    renewTokens: mutateAsync,
    isRefreshing: isLoading,
    isErrorRefresh: isError,
    errorRefresh: error,
  } as const;
}
