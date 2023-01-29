import { sign } from "jsonwebtoken";

export const generateJWT = (data: object, secret: string, expIn: string) => {
  const token = sign(data, secret, { expiresIn: expIn });
  return token;
};
