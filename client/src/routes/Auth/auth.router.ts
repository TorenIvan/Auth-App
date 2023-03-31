import { AuthLayout as Layout } from "../../layouts";
import { Login, loginAction, Register } from "../../pages";

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
      },
    ],
  },
];
export default authRoutes;
