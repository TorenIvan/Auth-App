import { Fragment } from "react";
import { Outlet } from "react-router-dom";

function Profile() {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}

export { Profile as Component };

