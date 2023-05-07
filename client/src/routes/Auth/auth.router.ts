import { QueryClient } from "@tanstack/react-query";
import { Layout } from "./layouts";
import {
  Login,
  loginAction,
  loginLoader,
  Register,
  registerAction,
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
          action: registerAction,
        },
      ],
    },
  ];
}
export default authRoutes;
