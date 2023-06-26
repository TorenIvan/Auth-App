import * as z from "zod";

const passwordSchema = z
  .string()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/);

function passwordValidator(password: string): boolean {
  try {
    passwordSchema.parse(password);
    return true;
  } catch (error) {
    return false;
  }
}

export function validatePassword(password: string): boolean {
  return passwordValidator(password);
}
