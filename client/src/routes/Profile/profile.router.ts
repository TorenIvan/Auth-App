import { QueryClient } from "@tanstack/react-query";

function profileRoutes(queryClient: QueryClient) {
  return [
    {
      path: "profile",
      children: [
        {
          index: true,
          lazy: () => import("./pages/ProfileDetails"),
        },
        {
          path: "edit",
          lazy: async () => {
            const module = await import("./pages/ProfileEdit");
            return {
              ...module,
              action: module.createEditProfileAction(queryClient),
            };
          },
        },
      ],
    },
  ];
}

export default profileRoutes;
