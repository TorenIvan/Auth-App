import * as jwt from "jsonwebtoken";
import { EnvironmentVariables } from "../../constants/EnvironmentVariables";

export const generateJWT = (data: object, secret: string, expIn: string) => {
  const token = jwt.sign(data, secret, { expiresIn: expIn });
  return token;
};

export const verifyJWT = (token: string, secret: string): TokenInterface => {
  const decodedData = jwt.verify(token, secret);
  return decodedData as TokenInterface;
};

export const generateAuthJWTs = (
  userId: string,
  signInWithCredentials: boolean = true
) => {
  const tokenPayload = {
    userId: userId,
    signInWithCredentials: signInWithCredentials,
  };

  const access_token = generateJWT(
    tokenPayload,
    EnvironmentVariables.Access_Token_Secret,
    EnvironmentVariables.Access_Token_Expiration_Time
  );

  const refresh_token = generateJWT(
    tokenPayload,
    EnvironmentVariables.Refresh_Token_Secret,
    EnvironmentVariables.Refresh_Token_Expiration_Time
  );

  return { access_token: access_token, refresh_token: refresh_token };
};
