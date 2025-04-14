import { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, redirect } from "react-router-dom";
import { ErrorPage, PrivateRoutes, PublicRoutes } from "../pages";
import { checkIfUserIsAuthenticated } from "../api";
import authRoutes from "./Auth";
import profileRoutes from "./Profile";

function indexRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    {
      path: "/",
      ErrorBoundary: ErrorPage,
      children: [
        {
          loader: loader,
          Component: PublicRoutes,
          children: [...authRoutes()],
        },
        {
          loader: loader,
          Component: PrivateRoutes,
          children: [
            {
              async lazy() {
                const { Component, loader } = await import("./Profile/layouts");
                return { Component: Component, loader: loader(queryClient) };
              },
              children: [
                ...profileRoutes(),
                // ...homeRoutes(),
              ],
            },
          ],
        },
        {
          index: true,
          loader: indexLoader,
        },
      ],
    },
    {
      path: "*",
      loader: indexLoader,
      ErrorBoundary: ErrorPage,
    },
  ]);
}

export default indexRouter;

async function indexLoader() {
  try {
    const isAuthenticated = await checkIfUserIsAuthenticated();
    console.log({isAuthenticated});
    
    if (isAuthenticated === true) {
      return redirect("profile");
    }
    return redirect("login");
  } catch (error: unknown) {
    return redirect("login");
  }
}

async function loader() {
  try {
    const isAuthenticated = await checkIfUserIsAuthenticated();
    if (isAuthenticated === true) {
      return true;
    }
    return false;
  } catch (error: unknown) {
    return false;
  }
}
