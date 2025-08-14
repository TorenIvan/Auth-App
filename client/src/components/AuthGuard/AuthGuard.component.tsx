import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../store";
import { Loader } from "../Loader";

const publicRoutes = [
  "/login",
  "/register",
  "/verify",
  "/forgot-password",
  "/reset-password",
];

export function AuthGuard() {
  const location = useLocation();
  const { isAuthenticated, isLoadingAuth } = useAuth();

  const isPublic: boolean = publicRoutes.some((route) => location.pathname.startsWith(route));
  const isAuthenticatedOnPublicRoute: boolean = isPublic === true && isAuthenticated === true;
  const isUnauthenticatedOnPrivateRoute: boolean = isPublic === false && isAuthenticated === false;

  if (isLoadingAuth) {
    return <Loader />;
  }
  if (isAuthenticatedOnPublicRoute) {
    return <Navigate to="/profile" replace />;
  }
  if (isUnauthenticatedOnPrivateRoute) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
