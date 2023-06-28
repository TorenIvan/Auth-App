export const Errors = {
  GenericError: "Something went wrong. Please, try again later!",
  InvalidCurrentPassword:
    "Current password must contain at least 1 upper case, numeric, and special character and be 8-36 characters long.",
  InvalidNewPassword:
    "New password must contain at least 1 upper case, numeric, and special character and be 8-36 characters long.",
  InvalidUsername: "Username must be 2 to 18 characters long",
  InvalidBiography: "Biography must be 100 or fewer characters long",
  InvalidPhoneNumber: "Phone number is invalid. Please, try again!",
} as const;
