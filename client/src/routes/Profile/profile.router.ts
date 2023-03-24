import { ErrorPage } from "../../pages";

const profileRoutes = [
  {
    path: "/profile",
    ErrorBoundary: ErrorPage,
    children: [
      {
        path: "/profile/edit",
      },
    ],
  },
];

export default profileRoutes;
