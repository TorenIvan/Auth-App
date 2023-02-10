import { ObjectId } from "mongodb";
import { Strings } from "../constants/Strings";

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
    data?: ServiceInsertedData | ServiceFoundData;
  };
  type ServiceFoundData = {
    userId: ObjectId;
  };
  type ServiceInsertedData = ServiceFoundData & {
    username: string;
    email: string;
    biography: string;
    phone: string;
  };

  interface TokenInterface {
    userId: string;
    type: string;
  }

  type TokenType =
    | Strings.ConfirmEmailType
    | Strings.ForgotPasswordType
    | undefined;

  type SendEmailAction =
    | Strings.ActionConfirmEmail
    | Strings.ActionResetPassword;
}

/* Just to make the file a module */
export {};
