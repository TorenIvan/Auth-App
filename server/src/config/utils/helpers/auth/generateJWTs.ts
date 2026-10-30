import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { EnvironmentVariables } from '../../constants/EnvironmentVariables';

export const generateJWT = (data: TokenInterface, secret: string, expIn: string) => {
  // jwtid makes every token unique, even when two are issued for the same user in the same second
  const token = jwt.sign(data, secret, { expiresIn: expIn, jwtid: randomUUID() });
  return token;
};

export const verifyJWT = (token: string, secret: string): TokenInterface => {
  const decodedData = jwt.verify(token, secret, { algorithms: ['HS256'] });
  return decodedData as TokenInterface;
};

/**
 * @description The expiration of a token is the single source of truth for cookie Max-Age and DB expiresAt.
 */
export const getTokenExpiration = (token: string): Date => {
  const decodedData = jwt.decode(token) as TokenInterface | null;
  if (!decodedData?.exp) {
    throw new Error('Token has no expiration');
  }
  return new Date(decodedData.exp * 1000);
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

/**
 * @description Both tokens carry the session id (sid): the refresh_tokens document that represents
 * this login (the token "family"). Rotation keeps the same sid.
 */
export const generateAuthJWTs = (
  userId: string,
  signInMethod: SignInMethod = 'credentials',
  sessionId: string
) => {
  const tokenPayload: TokenInterface = {
    userId: userId,
    signInMethod: signInMethod,
    sid: sessionId,
  };

  const access_token = generateAccessToken(tokenPayload);
  const refresh_token = generateRefreshToken(tokenPayload);

  return { access_token: access_token, refresh_token: refresh_token };
};
