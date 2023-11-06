import { Fragment, useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";

function PublicRoutes() {
  const navigate = useNavigate();
  const isAuthenticated = useLoaderData();
  const [showChildren, setShowChildren] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate(`${import.meta.env.VITE_CLIENT_URI}profile`);
    }
    if (isAuthenticated === false) {
      setShowChildren(true);
    }
  }, [isAuthenticated]);

  if (showChildren === true) {
    return (
      <Fragment>
        <Outlet />
      </Fragment>
    );
  }

  return null;
}

export { PublicRoutes as default };

