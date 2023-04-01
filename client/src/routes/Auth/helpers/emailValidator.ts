import * as z from "zod";

const emailSchema = z.string().email();

export function emailValidator(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch (error) {
    return false;
  }
}
