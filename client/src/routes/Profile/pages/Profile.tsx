import { QueryClient } from "@tanstack/react-query";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";
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
  return async function() {
    try {
      const query = userDetailsQuery();
      await queryClient.ensureQueryData(query);
      return true;
    } catch (error: unknown) {
      return false;
    }
  }
}






