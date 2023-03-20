import { toast } from "react-hot-toast";
import * as z from "zod";

const passwordSchema = z
  .string()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/);

export function passwordValidator(password: string) {
  try {
    passwordSchema.parse(password);
  } catch (error) {
    toast.error("Password is not valid");
    return false;
  }
}
