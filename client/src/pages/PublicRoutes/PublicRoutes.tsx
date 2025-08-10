import { useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";

function PublicRoutes() {
  const navigate = useNavigate();
  const isAuthenticated = useLoaderData();
  const [showChildren, setShowChildren] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      // If user IS authenticated, redirect to profile
      navigate(`/profile`, { replace: true });
    } else {
      // If user is NOT authenticated, show public routes (login, register, etc.)
      console.log("User not authenticated, showing public routes");
      setShowChildren(true);
    }
  }, [isAuthenticated, navigate]);

  console.log({ showChildren, isAuthenticated }, "public routes");
  
  if (showChildren === true) {
    return <Outlet />;
  }
  return null; 
}

export default PublicRoutes;