import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCheckIfUserIsAuthenticatedQuery } from '../../hooks';
import {
  useDiscordLoginMutation,
  useFacebookLoginMutation,
  useGithubLoginMutation,
  useGitlabLoginMutation,
  useGoogleLoginMutation,
  useLinkedinLoginMutation,
  useLoginMutation,
  useMicrosoftLoginMutation,
  useTwitterLoginMutation,
} from '../../routes/Auth/hooks';
import { Loader } from '../Loader';

export function AuthGuard() {
  const location = useLocation();
  const queryClient = useQueryClient();

  const { isLoggingInWithGoogle } = useGoogleLoginMutation();
  const { isLoggingInWithMicrosoft } = useMicrosoftLoginMutation();
  const { isLoggingInWithFacebook } = useFacebookLoginMutation();
  const { isLoggingInWithGithub } = useGithubLoginMutation();
  const { isLoggingInWithGitlab } = useGitlabLoginMutation();
  const { isLoggingInWithTwitter } = useTwitterLoginMutation();
  const { isLoggingInWithLinkedin } = useLinkedinLoginMutation();
  const { isLoggingInWithDiscord } = useDiscordLoginMutation();
  const { isLoggingIn } = useLoginMutation();
  const { isAuthenticated, isAuthenticating } = useCheckIfUserIsAuthenticatedQuery();

  const isLoadingAuth =
    isAuthenticating ||
    isLoggingIn ||
    isLoggingInWithGoogle ||
    isLoggingInWithMicrosoft ||
    isLoggingInWithFacebook ||
    isLoggingInWithGithub ||
    isLoggingInWithGitlab ||
    isLoggingInWithTwitter ||
    isLoggingInWithLinkedin ||
    isLoggingInWithDiscord;

  /**
   * *** Smart Selective Clearing::Reset all private-specific cached data after logging out ***
   */
  useEffect(() => {
    if (isAuthenticated === false) {
      queryClient.resetQueries(['user']);
    }
  }, [isAuthenticated]);

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

const publicRoutes = [
  '/login',
  '/register',
  '/verify',
  '/forgot-password',
  '/reset-password',
  '/oauth2/google',
  '/oauth2/microsoft',
  '/oauth2/facebook',
  '/oauth2/github',
  '/oauth2/gitlab',
  '/oauth2/twitter',
  '/oauth2/linkedin',
  '/oauth2/discord',
  '/terms-of-use',
  '/privacy-policy',
];
