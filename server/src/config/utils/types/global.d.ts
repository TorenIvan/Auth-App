import { ObjectId } from "mongodb";

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
    data?: ServiceInsertedData;
  };
  type ServiceInsertedData = {
    userId: ObjectId;
  };
}

/* Just to make the file a module */
export {};
