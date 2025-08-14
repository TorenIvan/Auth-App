import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Constants } from "../constants";
import { editUserData, userDetailsQuery } from "../api";
import { useEffect } from "react";

export function useEditUserDataMutation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate, isLoading, isError, isSuccess, error } = useMutation(editUserData); 

    useEffect(() => {
      if (isError) {
        toast.error(error as string);
      }
      if (isSuccess) {
        queryClient.invalidateQueries(userDetailsQuery.queryKey);
        toast.success(Constants.ProfileUpdatedSuccess);
        navigate("/profile");
      }
    }, [isError, isSuccess]);

    return {
      editUser: mutate,
      isMutating: isLoading,
      isError,
      isSuccess,
      error,
    } as const;
}