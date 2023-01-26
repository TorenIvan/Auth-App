declare global {
  type SignInMethod =
    | "credentials"
    | "facebook"
    | "twitter"
    | "google"
    | "github";
}

/* Just to make the file a module */
export {};
