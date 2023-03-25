import { Login, loginAction, Register } from "../../pages";

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
