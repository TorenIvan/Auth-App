import * as jwt from "jsonwebtoken";

export const generateJWT = (data: object, secret: string, expIn: string) => {
  const token = jwt.sign(data, secret, { expiresIn: expIn });
  return token;
};
