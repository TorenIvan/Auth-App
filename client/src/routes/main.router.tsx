import { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ErrorPage } from "../pages";
import { AuthGuard } from "../components";
import authRoutes from "./Auth";
import profileRoutes from "./Profile";

function indexRouter(queryClient: QueryClient) {
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
        ...profileRoutes(queryClient)
      ],
    },
  ]);
}

export default indexRouter;