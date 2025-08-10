import { useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";

function PublicRoutes() {
  const navigate = useNavigate();
  const isAuthenticated = useLoaderData();
  const [showChildren, setShowChildren] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/profile`, {
        replace: true
      });
    } else {
      console.log("perasa 1");
      setShowChildren(true);
    }
  }, [isAuthenticated, navigate]);

  console.log({ showChildren }, "public");
  if (showChildren === true) {
    return <Outlet />;
  }
  return undefined;
}

export default PublicRoutes;
