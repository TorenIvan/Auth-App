import { QueryClient } from "@tanstack/react-query";
import { Fragment } from "react";
import { toast } from "react-hot-toast";
import { Outlet, redirect } from "react-router-dom";
import { userDetailsQuery } from "../api";

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
      const query = userDetailsQuery();
      return (
        queryClient.getQueryData(query.queryKey) ??
        (await queryClient.fetchQuery(query))
      );
    } catch (error: unknown) {
      toast.error(error as string);
      return redirect("../login");
    }
  };
}
