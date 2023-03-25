import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import { ProfileHeader } from "./layouts";

function Profile() {
  return (
    <Fragment>
      <ProfileHeader />
      <Outlet />
    </Fragment>
  );
}

export default Profile;
