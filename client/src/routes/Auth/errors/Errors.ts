export const Errors = {
  GenericError: "Something went wrong. Please, try again later!",
  InvalidEmail: "Email is not valid. Please try again!",
  InvalidPassword:
    "Password must contain at least 1 upper case, numeric, and special character.\n Please try again!",
  NoConfirmationToken: "No email confirmation token was provided",
  InvalidConfirmationToken: "Invalid confirmation link provided",
} as const;
