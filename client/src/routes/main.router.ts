import { createBrowserRouter, Navigate } from "react-router-dom";
import { ErrorPage, Profile } from "../pages";
import authRoutes from "./Auth";
import profileRoutes from "./Profile";

const indexRouter = createBrowserRouter([
  {
    path: "/",
    // element:  => <Navigate to="profile/details" />,
    ErrorBoundary: ErrorPage,
    children: [...authRoutes, ...profileRoutes],
  },
]);

export default indexRouter;
