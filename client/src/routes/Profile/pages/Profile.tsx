import { QueryClient } from "@tanstack/react-query";
import { Fragment } from "react";
import { toast } from "react-hot-toast";
import { Outlet, redirect } from "react-router-dom";
import { userDetailsQuery } from "../api";
import { checkIfUserIsAuthenticated } from "../../Auth/api";

function Profile() {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}

export { Profile as default, loader };

function loader(queryClient: QueryClient) {
  return async function () {
    try {
      const isAuthenticated = await checkIfUserIsAuthenticated();
      if (isAuthenticated === false) {
        return redirect("../login");
      }
      const query = userDetailsQuery();
      await queryClient.ensureQueryData(query);
      return true;
    } catch (error: unknown) {
      toast.error(error as string);
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }
  };
}
