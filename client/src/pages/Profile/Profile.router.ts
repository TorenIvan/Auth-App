import { ProfileDetailsRouter, ProfileEditRouter } from "./pages";
import Profile from "./Profile";

const profileRoutes = [
  {
    path: "profile",
    Component: Profile,
    children: [ProfileDetailsRouter, ProfileEditRouter],
  },
];

export default profileRoutes;
