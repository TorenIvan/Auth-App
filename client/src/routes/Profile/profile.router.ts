import { Profile, ProfileDetails, ProfileEdit } from "../../pages";

const profileRoutes = [
  {
    path: "profile/",
    Component: Profile,
    children: [
      {
        path: "",
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
