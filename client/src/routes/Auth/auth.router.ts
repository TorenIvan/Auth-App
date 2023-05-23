import { QueryClient } from "@tanstack/react-query";
import { Layout } from "./layouts";
import {
  ForgotPassword,
  Login,
  loginAction,
  loginLoader,
  Register,
  registerAction,
  registerLoader,
  ResetPassword,
} from "./pages";

function authRoutes(queryClient: QueryClient) {
  return [
    {
      path: "",
      Component: Layout,
      children: [
        {
          path: "login",
          Component: Login,
          loader: loginLoader(queryClient),
          action: loginAction(queryClient),
        },
        {
          path: "register",
          Component: Register,
          loader: registerLoader,
          action: registerAction,
        },
        {
          path: "confirm-email",
        },
        {
          path: "forgot-password",
          Component: ForgotPassword,
        },
        {
          path: "reset-password",
          Component: ResetPassword,
        },
      ],
    },
  ];
}
export default authRoutes;
