import { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, redirect } from "react-router-dom";
import { ErrorPage } from "../pages";
import authRoutes from "./Auth";
import { checkIfUserIsAuthenticated } from "../api";
import profileRoutes from "./Profile";

function indexRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    {
      path: "/",
      ErrorBoundary: ErrorPage,
      children: [
        {
          index: true,
          loader: loader,
        },
        ...authRoutes(),
        ...profileRoutes(queryClient),
      ],
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
