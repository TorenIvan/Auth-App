import * as jwt from 'jsonwebtoken';
import { EnvironmentVariables } from '../../constants/EnvironmentVariables';

export const generateJWT = (data: TokenInterface, secret: string, expIn: string) => {
  const token = jwt.sign(data, secret, { expiresIn: expIn });
  return token;
};

export const verifyJWT = (token: string, secret: string): TokenInterface => {
  const decodedData = jwt.verify(token, secret);
  return decodedData as TokenInterface;
};

export const generateAccessToken = (data: TokenInterface) => {
  const token = generateJWT(
    data,
    EnvironmentVariables.Access_Token_Secret,
    EnvironmentVariables.Access_Token_Expiration_Time
  );
  return token;
};

export const generateRefreshToken = (data: TokenInterface) => {
  const token = generateJWT(
    data,
    EnvironmentVariables.Refresh_Token_Secret,
    EnvironmentVariables.Refresh_Token_Expiration_Time
  );
  return token;
};

export const generateAuthJWTs = (userId: string, signInMethod: SignInMethod = 'credentials') => {
  const tokenPayload: TokenInterface = {
    userId: userId,
    signInMethod: signInMethod,
  };

  const access_token = generateAccessToken(tokenPayload);
  const refresh_token = generateRefreshToken(tokenPayload);

  return { access_token: access_token, refresh_token: refresh_token };
};
