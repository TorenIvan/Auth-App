import { createBrowserRouter } from "react-router-dom";
import { ErrorPage, Login } from "../pages";
import authRoutes from "./Auth";
import profileRoutes from "./Profile";

const indexRouter = createBrowserRouter([
  {
    path: "/",
    Component: Login,
    ErrorBoundary: ErrorPage,
  },
  ...authRoutes,
  ...profileRoutes,
]);

export default indexRouter;
