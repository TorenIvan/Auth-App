import { Login, Register } from "../../pages";
import { loginAction } from "../../pages/Login";

const authRoutes = [
  {
    path: "login",
    Component: Login,
    action: loginAction,
  },
  {
    path: "register",
    Component: Register,
  },
];

export default authRoutes;
