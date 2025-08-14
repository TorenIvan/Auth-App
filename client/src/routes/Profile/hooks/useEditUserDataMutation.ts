import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Errors } from "../errors";
import { Constants } from "../constants";
import { editUserData, userDetailsQuery } from "../api";

export function useEditUserDataMutation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate, isLoading, isError, isSuccess, error } = useMutation(editUserData); 

    useEffect(() => {
      if (isError) {
        if (typeof error === 'string' || error instanceof String) {
          toast.error(error as string);
        } else {
          toast.error(Errors.GenericError);
        }
      }
      if (isSuccess) {
        queryClient.invalidateQueries(userDetailsQuery.queryKey);
        toast.success(Constants.ProfileUpdatedSuccess);
        navigate("/profile");
      }
    }, [isError, isSuccess, error]);

    return {
      editUser: mutate,
      isMutating: isLoading,
      isError,
      isSuccess,
      error,
    } as const;
}