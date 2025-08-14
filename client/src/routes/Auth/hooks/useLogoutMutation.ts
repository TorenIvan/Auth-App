import { useCallback } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAuthorizationHeader } from "../../../config";
import { Errors } from "../errors";
import { logoutUser } from "../../Profile/api";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isError } = useMutation(logoutUser);

  const logout = useCallback(async () => {
    try {
      await mutateAsync();
      addAuthorizationHeader("")
      queryClient.removeQueries();
      queryClient.clear();
    } catch (localError) {
      if (typeof localError === 'string' || localError instanceof String) {
        toast.error(localError as string);
      } else {
        toast.error(Errors.GenericError);
      }       
    }
  }, [])

  return {
   logout,
   isLoggingOut: isLoading,
   isErrorLogout: isError,
  } as const;
}