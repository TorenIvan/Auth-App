import * as z from "zod";

const passwordSchema = z
  .string()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/);

export function passwordValidator(password: string): boolean {
  try {
    passwordSchema.parse(password);
    return true;
  } catch (error) {
    return false;
  }
}
