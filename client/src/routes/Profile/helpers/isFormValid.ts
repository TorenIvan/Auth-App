import { isUsernameValid } from "./isUsernameValid";
import { isPasswordValid } from "./isPasswordValid";
import { isBiographyValid } from "./isBiographyValid";
import { isPhoneValid } from "./isPhoneValid";
import { toast } from "react-hot-toast";
import { Errors } from "../errors";

export function isFormValid(formData: FormData): boolean {
  for (const [key, value] of formData.entries()) {
    const keyString = key as string;
    const valueString = (value as string).trim();

    switch (keyString) {
      case "username":
        if (isUsernameValid(valueString) === false) {
          toast.error(Errors.InvalidUsername);
          return false;
        }
        break;

      case "biography":
        if (isBiographyValid(valueString) === false) {
          toast.error(Errors.InvalidBiography);
          return false;
        }
        break;

      case "phone":
        if (isPhoneValid(valueString) === false) {
          toast.error(Errors.InvalidPhoneNumber);
          return false;
        }
        break;

      case "currentPassword":
      case "newPassword":
        const isPasswordEmpty: boolean = valueString.length === 0;
        if (!isPasswordEmpty && isPasswordValid(valueString) === false) {
          if (keyString === "currentPassword") {
            toast.error(Errors.InvalidCurrentPassword);
          }
          if (keyString === "newPassword") {
            toast.error(Errors.InvalidNewPassword);
          }
          return false;
        }
        break;
    }
  }

  return true;
}
