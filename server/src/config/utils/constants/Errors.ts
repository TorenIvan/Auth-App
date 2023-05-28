export const Errors = {
  EmailRequired: "Email is required",
  EmailInvalid: "Please enter a valid email address",
  PasswordRequired: "Password is required",
  PasswordInvalid:
    "Invalid password. Password must contain at least one uppercase letter, one lowercase letter, one digit, and be 8-36 characters long",
  TokenRequired: "Token is required",
  UsernameMinimum: "Name must be 2 or more characters long",
  UsernameMaximum: "Name must be 18 or fewer characters long",
  UserAlreadyExists: "Email address already exists",
  UserNotFoundWithTheseCreds:
    "The specified email address could not be authenticated. Please, try registering again",
  UserNotFoundInConfirmation:
    "Something went wrong with this link. Please register again!",
  TokenExpired:
    "Oops, your confirmation link is no longer valid. Try login in to send a new one!",
  IncorrectToken:
    "Oops, seems like the confirmation link is not correct. Make sure to press the correct link",
  GenericErrorResetPassword:
    "Oops, something went wrong. Please, try reseting your password",
  ConfirmEmailInOrderToContinue:
    "A new validation email link will be sent to your email soon. Please, confirm it in order to proceed",
  PasswordsNotSame: "Passwords do not match. Please, try again",
  GenericError: "Something went wrong. Please, try again!",
  IncorrectPassword:
    "The current password you provided is not correct. Please, try again",
  SignInMethodUpdatePassword:
    "It is not possible to add or update password with the current sign in method",
  FillInPassword: "Please, fill the current password before updating it",
} as const;
