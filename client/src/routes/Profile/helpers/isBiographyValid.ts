import * as z from "zod";

const biographySchema = z.string().trim().max(500);

function biographySchemaValidator(biography: string): boolean {
  try {
    biographySchema.parse(biography);
    return true;
  } catch (error) {
    return false;
  }
}

export function isBiographyValid(biography: string): boolean {
  return biographySchemaValidator(biography);
}
