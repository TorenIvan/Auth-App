import { useCallback } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAuthorizationHeader } from "../../../config";
import { Errors } from "../errors";
import { loginUser } from "../api";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isError } = useMutation(loginUser);

  const login = useCallback(async ({ email, password }: { email: string, password: string }) => {
    try {
      const accessToken = await mutateAsync({ email, password })
      addAuthorizationHeader(accessToken)
      queryClient.setQueryData(['auth'], true);
    } catch (localError) {
      if (typeof localError === 'string' || localError instanceof String) {
        toast.error(localError as string);
      } else {
        toast.error(Errors.GenericError);
      }       
    }
  }, [])

  return {
   login,
   isLoggingIn: isLoading,
   isErrorLogin: isError,
  } as const;
}