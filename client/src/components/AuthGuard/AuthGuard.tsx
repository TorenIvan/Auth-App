import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../Loader";
import { useEffect, useMemo } from "react";
import { useFacebookLoginMutation, useLoginMutation } from "../../routes/Auth/hooks";
import { useCheckIfUserIsAuthenticatedQuery } from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";

const publicRoutes = [
  "/login",
  "/register",
  "/verify",
  "/forgot-password",
  "/reset-password",
  "/oauth2/facebook"
];

export function AuthGuard() {
  const location = useLocation();
  const queryClient = useQueryClient();

  const { isLoggingInWithFacebook } = useFacebookLoginMutation();
  const { isLoggingIn } = useLoginMutation();
  const { isAuthenticated, isAuthenticating } = useCheckIfUserIsAuthenticatedQuery();

  const isLoadingAuth = useMemo(() => 
    isAuthenticating || isLoggingIn || isLoggingInWithFacebook, 
  [isAuthenticating, isLoggingIn, isLoggingInWithFacebook]);

  /**
   * *** Smart Selective Clearing::Reset all private-specific cached data after logging out ***
   */
  useEffect(() => {
    if (isAuthenticated === false) {
      queryClient.resetQueries(['user']);
    }
  }, [isAuthenticated])

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
