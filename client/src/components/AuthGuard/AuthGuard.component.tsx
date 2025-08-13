import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const publicRoutes = [
  "/login",
  "/register",
  "/verify",
  "/forgot-password",
  "/reset-password",
];

export function AuthGuard() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isLoadingAuth: boolean = isAuthenticated === undefined;
  const isPublic: boolean = publicRoutes.some((route) => location.pathname.startsWith(route));
  const isAuthenticatedOnPublicRoute: boolean = isPublic === true && isAuthenticated === true;
  const isUnauthenticatedOnPrivateRoute: boolean = isPublic === false && isAuthenticated === false;

  if (isLoadingAuth) {
    return <FontAwesomeIcon icon={faSpinner} spinPulse color="red" width={80}/>
  }
  if (isAuthenticatedOnPublicRoute) {
    return <Navigate to="/profile" replace />;
  }
  if (isUnauthenticatedOnPrivateRoute) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
