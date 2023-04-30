import { Layout } from "./layouts";
import { Login, loginAction, Register, registerAction } from "./pages";

const authRoutes = [
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
export default authRoutes;
