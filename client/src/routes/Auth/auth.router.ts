import { Login, Register } from "../../pages";

const authRoutes = [
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
];

export default authRoutes;
