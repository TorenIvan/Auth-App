function profileRoutes() {
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
          lazy: () => import("./pages/ProfileEdit"),
        },
      ],
    },
  ];
}

export default profileRoutes;
