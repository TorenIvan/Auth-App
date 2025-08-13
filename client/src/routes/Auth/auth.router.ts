function authRoutes() {
  return [
    {
      path: "",
      lazy: () => import("./layouts"),
      children: [
        {
          path: "login",
          lazy: () => import("./pages/Login"),
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
        },
      ],
    },
  ];
}

export default authRoutes;
