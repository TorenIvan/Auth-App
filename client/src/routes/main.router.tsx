import { createBrowserRouter, Navigate } from "react-router-dom";
import { ErrorPage } from "../pages";
import { AuthGuard } from "../components";
import authRoutes from "./Auth";
import profileRoutes from "./Profile";

function indexRouter(login: (req: ILoginRequest) => Promise<void>) {
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
        ...authRoutes(login),
        ...profileRoutes()
      ],
    },
  ]);
}

export default indexRouter;

interface ILoginRequest {
  email: string;
  password: string;
}