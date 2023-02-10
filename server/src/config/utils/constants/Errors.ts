export const Errors = {
  UserAlreadyExists: "Email address already exists",
  UserNotFoundWithTheseCreds:
    "The specified email address could not be authenticated. Please, try registering again",
  UserNotFoundInConfirmation:
    "Something went wrong with this link. Please register again!",
  TokenExpired:
    "Oops, your confirmation link is no longer valid. Try login in to send a new one!",
  IncorrectToken:
    "Oops, seems like the confirmation link is not correct. Make sure to press the correct link",
  ConfirmEmailInOrderToContinue:
    "A new validation email link will be sent to your email soon. Please, confirm it in order to proceed",
  PasswordsNotSame: "Passwords do not match. Please, try again",
} as const;
