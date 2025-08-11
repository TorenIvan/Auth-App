import { createBrowserRouter, Navigate } from "react-router-dom";
import { ErrorPage } from "../pages";
import { AuthGuard } from "../components";
import authRoutes from "./Auth";
import profileRoutes from "./Profile";

function indexRouter() {
  return createBrowserRouter([
    {
      path: "/",
      element: <AuthGuard />,
      ErrorBoundary: ErrorPage,
      children: [
        {
          index: true,
          element: <Navigate to="/profile" replace />,
        },
        ...authRoutes(),
        ...profileRoutes()
      ],
    },
  ]);
}

export default indexRouter;
