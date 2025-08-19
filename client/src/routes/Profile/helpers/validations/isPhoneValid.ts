import * as z from 'zod';

const phoneSchema = z.string().regex(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$|^$/);

function phoneValidator(phone: string): boolean {
  try {
    phoneSchema.parse(phone);
    return true;
  } catch (error) {
    return false;
  }
}

export function isPhoneValid(phone: string): boolean {
  return phoneValidator(phone);
}
