export const Errors = {
  GenericError: "Something went wrong. Please, try again later!",
  InvalidEmail: "Email is not valid. Please try again!",
  InvalidPassword:
    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be 8-36 characters long",
  NoConfirmationToken: "No email confirmation token was provided",
  NoResetToken: "No email reset token was provided",
  InvalidConfirmationToken: "Invalid confirmation link provided",
  InvalidResetToken: "Invalid email reset link provided",
  AlreadyAuthenticated:
    "It seems that you are already authenticated with an account. In case you are using another email as well, please logout and click the confirmation link again. Else it seems that you are already verified",
  AlreadyAuthenticatedOnReset:
    "It seems that you are already authenticated with an account. To continue with reset email operation, please logout and click the email link again. Otherwise, ignore the email.",
  InvalidQueryParameters: "Invalid url; something went wrong, please try again",
  InvalidCSRFToken: "Invalid url; suspicious act found; redirecting...",
  UserDeniedFacebook: "It seems that you denied to authorize facebook, redirecting to login",
  UserAlreadyAuthenticated: "It seems that user is already authenticated, redirecting to login"
} as const;
