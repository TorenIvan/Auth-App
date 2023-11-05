import { useQuery } from "@tanstack/react-query";
import { retrieveToken } from "../api";

export function useFacebookLogin({ code }: { code: string | boolean }): UseFacebookLogin {
  const { data, error, isLoading } = useQuery(['facebookLogin'], () => retrieveToken(code), {
    enabled: !!code,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  return { data, error, isLoading };
}

interface UseFacebookLogin {
  data: string | void | undefined;
  error: unknown;
  isLoading: boolean;
}
