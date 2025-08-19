import * as z from 'zod';

const emailSchema = z.string().email();

function emailValidator(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch (error) {
    return false;
  }
}

export function isEmailValid(email: string): boolean {
  return emailValidator(email);
}
