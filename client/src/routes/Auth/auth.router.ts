import { Login, loginAction } from "./pages";

function authRoutes(loginContext: ({ email, password }: { email: string, password: string }) => Promise<void>) {
  return [
    {
      path: "",
      lazy: () => import("./layouts"),
      children: [
        {
          path: "login",
          Component: Login,
          action: loginAction(loginContext)
        },
        {
          path: "register",
          lazy: () => import("./pages/Register"),
        },
        {
          path: "verify",
          lazy: () => import("./pages/ConfirmEmail"),
        },
        {
          path: "forgot-password",
          lazy: () => import("./pages/ForgotPassword"),
        },
        {
          path: "reset-password",
          lazy: () => import("./pages/ResetPassword"),
        },
        {
          path: "oauth2/facebook",
          lazy: () => import("./pages/LoginFacebook"),
        }
      ],
    },
  ];
}

export default authRoutes;
