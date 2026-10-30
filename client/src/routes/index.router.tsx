import { createBrowserRouter, Navigate } from 'react-router';
import { ErrorPage } from '../pages';
import { AuthGuard } from '../components';
import authRoutes from './Auth';
import profileRoutes from './Profile';

const indexRouter = createBrowserRouter([
  {
    path: '/',
    Component: AuthGuard,
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        element: <Navigate to="/profile" replace />,
      },
      ...authRoutes,
      ...profileRoutes,
      {
        path: '*',
        element: <Navigate to="/profile" replace />,
      },
    ],
  },
]);

export default indexRouter;
