import { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "../pages";
import authRoutes from "./Auth";
import profileRoutes from "./Profile";

function indexRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    {
      path: "/",
      ErrorBoundary: ErrorPage,
      children: [...authRoutes(queryClient), ...profileRoutes(queryClient)],
    },
  ]);
}

export default indexRouter;
