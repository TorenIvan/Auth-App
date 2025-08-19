import * as z from 'zod';

const usernameSchema = z.string().trim().min(2).max(18);

function usernameValidator(password: string): boolean {
  try {
    usernameSchema.parse(password);
    return true;
  } catch (error) {
    return false;
  }
}

export function isUsernameValid(username: string): boolean {
  return usernameValidator(username);
}
