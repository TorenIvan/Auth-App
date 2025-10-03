const profileRoutes = [
  {
    path: 'profile',
    lazy: () => import('./layouts'),
    children: [
      {
        index: true,
        lazy: () => import('./pages/ProfileDetails'),
      },
      {
        path: 'edit',
        lazy: () => import('./pages/ProfileEdit'),
      },
    ],
  },
];

export default profileRoutes;
