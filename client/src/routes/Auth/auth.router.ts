import { QueryClient } from "@tanstack/react-query";
import { Layout } from "./layouts";
import { Login, loginAction, Register, registerAction } from "./pages";

function authRoutes(queryClient: QueryClient) {
  return [
    {
      path: "",
      Component: Layout,
      children: [
        {
          path: "login",
          Component: Login,
          action: loginAction,
        },
        {
          path: "register",
          Component: Register,
          action: registerAction,
        },
      ],
    },
  ];
}
export default authRoutes;
