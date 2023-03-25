import { Profile, ProfileDetails, ProfileEdit } from "../../pages";

const profileRoutes = [
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
];

export default profileRoutes;
