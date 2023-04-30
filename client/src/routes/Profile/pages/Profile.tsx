import { Fragment } from "react";
import { toast } from "react-hot-toast";
import { Outlet, redirect } from "react-router-dom";
import { globalQueryClient } from "../../../App";
import { userDetailsQuery } from "../api";

function Profile() {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}

export { Profile as default, loader };

async function loader() {
  try {
    const query = userDetailsQuery();
    return (
      globalQueryClient.getQueryData(query.queryKey) ??
      (await globalQueryClient.fetchQuery(query))
    );
  } catch (error: unknown) {
    toast.error(error as string);
    return redirect("/login");
  }
}
