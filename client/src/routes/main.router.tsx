import { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, redirect } from "react-router-dom";
import { ErrorPage } from "../pages";
import { checkIfUserIsAuthenticated } from "../api";
import authRoutes from "./Auth";
import profileRoutes from "./Profile";

function indexRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    {
      path: "/",
      ErrorBoundary: ErrorPage,
      children: [
        ...authRoutes(),
        ...profileRoutes(queryClient),
        {
          index: true,
          loader: loader,
        },
      ],
    },
    {
      path: "*",
      loader: loader,
      ErrorBoundary: ErrorPage,
    },
  ]);
}

export default indexRouter;

async function loader() {
  try {
    const isAuthenticated = await checkIfUserIsAuthenticated();
    if (isAuthenticated === true) {
      return redirect("profile");
    }
    return redirect("login");
  } catch (error: unknown) {
    return redirect("login");
  }
}
