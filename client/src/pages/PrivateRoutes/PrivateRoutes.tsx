import { Fragment, useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";

function PrivateRoutes() {
  const navigate = useNavigate();
  const isAuthenticated = useLoaderData();
  const [showChildren, setShowChildren] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate(`${import.meta.env.VITE_CLIENT_URI}login`);
    }
    if (isAuthenticated === true) {
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

export { PrivateRoutes as default };

