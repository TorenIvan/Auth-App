function profileRoutes() {
  return [
    {
      path: "profile",
      lazy: () => import("./layouts"),
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
              action: module.createEditProfileAction(),
            };
          },
        },
      ],
    },
  ];
}

export default profileRoutes;
