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
      console.log("Mpika re gmt");
      const query = userDetailsQuery();
      console.log("se eida");
      const results = await queryClient.ensureQueryData(query);
      console.log("results: ", results);
      return results;
    } catch (error: unknown) {
      console.log("Mpika re gmt se error");
      toast.error(error as string);
      return redirect("../login");
    }
  };
}
