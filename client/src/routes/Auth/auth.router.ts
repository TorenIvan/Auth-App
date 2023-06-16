import { QueryClient } from "@tanstack/react-query";
import { Layout } from "./layouts";
import {
  ConfirmEmail,
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
          path: "verify",
          Component: ConfirmEmail,
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
