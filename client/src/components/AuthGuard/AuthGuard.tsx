import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useCheckIfUserIsAuthenticatedQuery } from '../../hooks';
import { Loader } from '../Loader';

export function AuthGuard() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated, isAuthenticating } = useCheckIfUserIsAuthenticatedQuery();

  /**
   * *** Smart Selective Clearing::Reset all private-specific cached data after logging out ***
   */
  useEffect(() => {
    if (isAuthenticated === false) {
      queryClient.resetQueries({ queryKey: ['user'] });
    }
  }, [isAuthenticated]);

  const isPublic: boolean = publicRoutes.some((route) => location.pathname.startsWith(route));
  const isAuthenticatedOnPublicRoute: boolean = isPublic === true && isAuthenticated === true;
  const isUnauthenticatedOnPrivateRoute: boolean = isPublic === false && isAuthenticated === false;

  if (isAuthenticating) {
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

const publicRoutes = [
  '/login',
  '/register',
  '/verify',
  '/forgot-password',
  '/reset-password',
  '/oauth2/google',
  '/oauth2/facebook',
  '/oauth2/github',
  '/oauth2/gitlab',
  '/oauth2/discord',
  '/terms-of-use',
  '/privacy-policy',
];
