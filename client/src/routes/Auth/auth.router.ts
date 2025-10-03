const authRoutes = [
  {
    path: '',
    lazy: () => import('./layouts'),
    children: [
      {
        path: 'login',
        lazy: () => import('./pages/Login'),
      },
      {
        path: 'register',
        lazy: () => import('./pages/Register'),
      },
      {
        path: 'verify',
        lazy: () => import('./pages/ConfirmEmail'),
      },
      {
        path: 'forgot-password',
        lazy: () => import('./pages/ForgotPassword'),
      },
      {
        path: 'reset-password',
        lazy: () => import('./pages/ResetPassword'),
      },
      {
        path: 'oauth2/google',
        lazy: () => import('./pages/LoginGoogle'),
      },
      {
        path: 'oauth2/microsoft',
        lazy: () => import('./pages/LoginMicrosoft'),
      },
      {
        path: 'oauth2/facebook',
        lazy: () => import('./pages/LoginFacebook'),
      },
      {
        path: 'oauth2/github',
        lazy: () => import('./pages/LoginGithub'),
      },
      {
        path: 'oauth2/gitlab',
        lazy: () => import('./pages/LoginGitlab'),
      },
      {
        path: 'oauth2/twitter',
        lazy: () => import('./pages/LoginTwitter'),
      },
      {
        path: 'oauth2/linkedin',
        lazy: () => import('./pages/LoginLinkedin'),
      },
      {
        path: 'oauth2/discord',
        lazy: () => import('./pages/LoginDiscord'),
      },
      {
        path: 'terms-of-use',
        lazy: () => import('../../pages/TermsOfUse'),
      },
      {
        path: 'privacy-policy',
        lazy: () => import('../../pages/PrivacyPolicy'),
      },
    ],
  },
];

export default authRoutes;
