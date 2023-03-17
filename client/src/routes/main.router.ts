import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages";
import authRoutes from "./Auth";
import profileRoutes from "./Profile";

const indexRouter = createBrowserRouter([
  {
    path: "/",
    Component: Login,
    // ErrorBoundary:
  },
  ...authRoutes,
  ...profileRoutes,
]);

export default indexRouter;
