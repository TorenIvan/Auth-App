import { toast } from "react-hot-toast";
import * as z from "zod";

const emailSchema = z.string().email();

export function emailValidator(email: string) {
  try {
    emailSchema.parse(email);
    return true;
  } catch (error) {
    toast.error("Email is not valid");
    return false;
  }
}
