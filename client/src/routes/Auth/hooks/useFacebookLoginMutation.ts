import { useMutation, useQueryClient } from "@tanstack/react-query";
import { facebookLogin } from "../api";
import { useEffect } from "react";
import { addAuthorizationHeader } from "../../../config";
import toast from "react-hot-toast";
import { Errors } from "../errors";

export function useFacebookLoginMutation(): UseFacebookLogin {
  const queryClient = useQueryClient();
  const { data, mutate, mutateAsync, isLoading, error, isError } = useMutation({
    mutationFn: (code: string | boolean) => facebookLogin(code),
    retry: 1,
  });
  

  useEffect(() => {
    if (data) {
      addAuthorizationHeader(data);
      queryClient.setQueryData(["auth", "status"], true);
    }
    if (isError) {
      toast.error(typeof error === "string" ? error : Errors.GenericError);
      if (error === Errors.AUserAlreadyAuthenticated) {
        queryClient.setQueryData(["auth", "status"], true);
      }
    }
  }, [data, error, queryClient, isError]);

  return {
    data: data,
    error: error,
    isError,
    isLoggingInWithFacebook: isLoading,
    mutate: mutate,
    mutateAsync: mutateAsync,
  };
}

interface UseFacebookLogin {
  data: string | void | undefined;
  error: unknown;
  isError: boolean;
  isLoggingInWithFacebook: boolean;
  mutate: (code: string | boolean) => void;
  mutateAsync: (code: string | boolean) => Promise<string | void>;
}