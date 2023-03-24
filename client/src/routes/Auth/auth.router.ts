import { ErrorPage, Login, Register } from "../../pages";
import { loginAction } from "../../pages/Login";

const authRoutes = [
  {
    path: "/login",
    Component: Login,
    ErrorBoundary: ErrorPage,
    action: loginAction,
  },
  {
    path: "/register",
    Component: Register,
    ErrorBoundary: ErrorPage,
  },
];

export default authRoutes;
