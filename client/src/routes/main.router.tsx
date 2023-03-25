import { createBrowserRouter, Navigate } from "react-router-dom";
import { ErrorPage } from "../pages";
import authRoutes from "./Auth";
import profileRoutes from "./Profile";

const indexRouter = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: ErrorPage,
    children: [...authRoutes, ...profileRoutes],
    /**
     * Redirect based on loader function here that checks for token;
     * in order to avoid loop on Navigate
     */
  },
]);

export default indexRouter;
