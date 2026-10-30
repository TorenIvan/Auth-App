export const Strings = {
  CloseDB: 'Closing DataBase...',
  VerificationEmailSubject: 'Authentication App Email Verification',
  ResetEmailSubject: 'Authentication App Email Reset',
  VerificationEmailText: 'Authentication App Dev Team',
  ConfirmEmailType: 'confirmEmail',
  ForgotPasswordType: 'forgotPassword',
  ActionConfirmEmail: 'verify your account',
  ActionResetPassword: 'reset your password',
  Login: 'Login',
  Register: 'Register',
  AuthCookiePath: '/api/v1/auth',
  LoggedOut: 'Logged out successfully',
  LoggedOutAllDevices: 'Logged out from all devices successfully',
  /**
   * A just-rotated refresh token is still accepted for this window, so an aborted refresh response
   * (e.g. a page reload mid-refresh) does not log the user out. Outside it, reuse revokes the session.
   */
  RefreshTokenReuseGraceMs: 10000,
} as const;
