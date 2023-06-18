import { QueryClient } from "@tanstack/react-query";
import { Layout } from "./layouts";
import {
  ForgotPassword,
  Login,
  loginAction,
  Register,
  registerAction,
  ResetPassword,
  ConfirmEmail,
  confirmEmailLoader,
} from "./pages";
import { checkIfUserIsAuthenticated } from "../../api";
import { redirect } from "react-router-dom";

function authRoutes(queryClient: QueryClient) {
  return [
    {
      path: "",
      Component: Layout,
      children: [
        {
          path: "login",
          Component: Login,
          loader: loader,
          action: loginAction,
        },
        {
          path: "register",
          Component: Register,
          loader: loader,
          action: registerAction,
        },
        {
          path: "verify",
          Component: ConfirmEmail,
          loader: confirmEmailLoader,
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

async function loader() {
  try {
    const isAuthenticated = await checkIfUserIsAuthenticated();

    if (isAuthenticated === true) {
      return redirect(`${import.meta.env.VITE_CLIENT_URI}profile`);
    }
    return true;
  } catch (error: unknown) {
    return true;
  }
}
