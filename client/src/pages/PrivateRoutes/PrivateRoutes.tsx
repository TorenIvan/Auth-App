import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLoaderData } from "react-router-dom";

function PrivateRoutes() {
  const navigate = useNavigate();
  const isAuthenticated = useLoaderData();
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // If user is NOT authenticated, redirect to login
      navigate(`/login`, { replace: true });
    } else {
      // If user IS authenticated, show private routes
      setShowChildren(true);
    }
  }, [isAuthenticated, navigate]);

  console.log({ showChildren, isAuthenticated }, "private routes");

  if (!showChildren) return null;
  return <Outlet />;
}

export default PrivateRoutes;