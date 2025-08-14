import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { userDetailsQuery } from "../api";

export function useRetrieveUserDataQuery() {
   const { data, isLoading, isFetching, isError, error } = useQuery(userDetailsQuery);

  useEffect(() => {
    if (isError) {
      toast.error(error as string);
    }
  }, [isError, error])

   return {
    userInfo: data,
    isLoading,
    isFetching,
    isError,
    error,
   } as const;
}