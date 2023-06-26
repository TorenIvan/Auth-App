export const Errors = {
  GenericError: "Something went wrong. Please, try again later!",
  InvalidEmail: "Email is not valid. Please try again!",
  InvalidPassword:
    "Password must contain at least 1 upper case, numeric, and special character. Please, try again!",
  NoConfirmationToken: "No email confirmation token was provided",
  NoResetToken: "No email reset token was provided",
  InvalidConfirmationToken: "Invalid confirmation link provided",
  InvalidResetToken: "Invalid email reset link provided",
  AlreadyAuthenticated:
    "It seems that you are already authenticated with an account. In case you are using another email as well, please logout and click the confirmation link again. Else it seems that you are already verified",
  AlreadyAuthenticatedOnReset:
    "It seems that you are already authenticated with an account. To continue with reset email operation, please logout and click the email link again. Otherwise, ignore the email.",
} as const;
