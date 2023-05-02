import { QueryClient } from "@tanstack/react-query";
import { Layout } from "./layouts";
import { Profile, profileLoader, ProfileDetails, ProfileEdit } from "./pages";

function profileRoutes(queryClient: QueryClient) {
  return [
    {
      path: "",
      Component: Layout,
      loader: profileLoader(queryClient),
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
}

export default profileRoutes;
