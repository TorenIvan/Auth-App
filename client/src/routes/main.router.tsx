import { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter } from "react-router-dom";
import { ErrorPage, PrivateRoutes, PublicRoutes } from "../pages";
import { checkIfUserIsAuthenticated } from "../api";
import authRoutes from "./Auth";
import profileRoutes from "./Profile";

function indexRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    {
      path: "/",
      ErrorBoundary: ErrorPage,
      loader: indexLoader,
      children: [
        {
          Component: PublicRoutes,
          children: [...authRoutes()],
        },
        {
          Component: PrivateRoutes,
          children: [
            {
              async lazy() {
                const { Component, loader } = await import("./Profile/layouts");
                return {
                  Component: Component,
                  loader: loader(queryClient),
                };
              },
              children: [...profileRoutes(queryClient)],
            },
          ],
        },
      ],
    },
  ]);
}

export default indexRouter;

async function indexLoader() {
  try {
    console.log("I am running index loader");
    const isAuthenticated = await checkIfUserIsAuthenticated();
    console.log({ isAuthenticated });

    // Only return the result, no redirects here
    return isAuthenticated;
  } catch (error: unknown) {
    console.error("Error during index loader:", error);
    return false; // Indicate that user is not authenticated
  }
}

// async function loader() {
//   try {
//     console.log("I am running loader");
//     const isAuthenticated = await checkIfUserIsAuthenticated();
//     if (isAuthenticated === true) {
//       return true;
//     }
//     return false;
//   } catch (error: unknown) {
//     return false;
//   }
// }
