import { Layout } from "./layouts";
import { Profile, profileLoader, ProfileDetails, ProfileEdit } from "./pages";

const profileRoutes = [
  {
    path: "",
    Component: Layout,
    loader: profileLoader,
    children: [
      {
        path: "profile",
        Component: Profile,
        children: [
          {
            index: true,
            Component: ProfileDetails,
          },
          {
            path: "edit",
            Component: ProfileEdit,
          },
        ],
      },
    ],
  },
];

export default profileRoutes;
