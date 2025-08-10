import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLoaderData } from "react-router-dom";

function PrivateRoutes() {
  const navigate = useNavigate();
  const isAuthenticated = useLoaderData();
  const [showChildren, setShowChildren] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/login`, {
        replace: true
      });
    } else {
      console.log("perasa 2");
      setShowChildren(true);
    }
  }, [isAuthenticated, navigate]);

  console.log({ showChildren }, "private");
  if (showChildren === true) {
    return <Outlet />;
  }
  return undefined;
}

export default PrivateRoutes;
