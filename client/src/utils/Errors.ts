export const DefaultError = {
  image:
    'https://images.unsplash.com/photo-1621252179027-94459d278660?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  title: 'I have bad news for you',
  body: 'Something went wrong with this page. Please, try again. Thank you!!!',
} as const;

export const Errors = {
  GenericError: 'Something went wrong. Please, try again later!',
  SessionExpired: 'Session expired. Redirecting to login...',
  InvalidCurrentPassword:
    'Current password must contain at least 1 upper case, numeric, and special character and be 8-36 characters long.',
  InvalidNewPassword:
    'New password must contain at least 1 upper case, numeric, and special character and be 8-36 characters long.',
  InvalidUsername: 'Username must be 2 to 18 characters long',
  InvalidBiography: 'Biography must be 100 or fewer characters long',
  InvalidPhoneNumber: 'Phone number is invalid. Please, try again!',
  InvalidEmail: 'Email is not valid. Please try again!',
  InvalidPassword:
    'Password must contain at least one uppercase letter, one lowercase letter, one digit, and be 8-36 characters long',
  NoConfirmationToken: 'No email confirmation token was provided',
  NoResetToken: 'No email reset token was provided',
  InvalidConfirmationToken: 'Invalid confirmation link provided',
  InvalidResetToken: 'Invalid email reset link provided',
  AlreadyAuthenticated:
    'It seems that you are already authenticated with an account. In case you are using another email as well, please logout and click the confirmation link again. Else it seems that you are already verified',
  AlreadyAuthenticatedOnReset:
    'It seems that you are already authenticated with an account. To continue with reset email operation, please logout and click the email link again. Otherwise, ignore the email.',
  InvalidQueryParameters: 'Invalid url; something went wrong, please try again',
  InvalidCSRFToken: 'Invalid url; suspicious act found; redirecting...',
  UserDeniedFacebook: 'It seems that you denied to authorize facebook, redirecting to login',
  UserAlreadyAuthenticated: 'It seems that user is already authenticated, redirecting to login',
  AUserAlreadyAuthenticated: 'It seems that a user is already authenticated, redirecting...',
} as const;
