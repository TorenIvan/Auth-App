import { redirect } from "react-router-dom";
import { Layout } from "./layouts";
import { checkIfUserIsAuthenticated } from "../../api";
import {
  Login,
  loginAction,
  Register,
  registerAction,
  ConfirmEmail,
  confirmEmailLoader,
  ForgotPassword,
  forgotPasswordAction,
  ResetPassword,
  resetPasswordLoader,
  resetPasswordAction,
  LoginFacebook,
  loginFacebookLoader,
} from "./pages";

function authRoutes() {
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
          loader: loader,
          action: forgotPasswordAction,
        },
        {
          path: "reset-password",
          Component: ResetPassword,
          loader: resetPasswordLoader,
          action: resetPasswordAction,
        },
        {
          path: "oauth2/facebook",
          Component: LoginFacebook,
          loader: loginFacebookLoader
        }
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
