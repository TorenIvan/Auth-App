import { QueryClient } from "@tanstack/react-query";
import { Fragment } from "react";
import { toast } from "react-hot-toast";
import { Outlet, redirect } from "react-router-dom";
import { userDetailsQuery } from "../api";
import { isAxiosError } from "axios";

function Profile() {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}

export { Profile as default, loader };

function loader(queryClient: QueryClient) {
  return async function() {
    try {
      const query = userDetailsQuery();
      await queryClient.ensureQueryData(query);
      return true;
    } catch (error: unknown) {
      console.log(error)
      if (error === "Unauthorized") { //Specific error returned by ensureQueryData
        return redirect('../login');
      }
      if (isAxiosError(error)) {
        const { response } = error;
        const statusCode = response?.status ?? 0;
        const message = response?.data?.message;
        if (statusCode !== 401) {
          toast.error(message);
          return redirect('../login');
        }
      }
    }
  }
}
