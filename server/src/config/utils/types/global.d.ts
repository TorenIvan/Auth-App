declare global {
  type SignInMethod =
    | "credentials"
    | "facebook"
    | "twitter"
    | "google"
    | "github";
  type ServiceResponse = {
    success: boolean;
    customError?: string;
  };
}

/* Just to make the file a module */
export {};
