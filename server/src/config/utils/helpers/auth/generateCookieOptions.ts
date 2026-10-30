import { Strings } from '../../constants/Strings';
import { getTokenExpiration } from './generateJWTs';

export type SameSiteType = boolean | 'none' | 'lax' | 'strict' | undefined;

/**
 * @description Max-Age in whole seconds (cookie libraries reject non-integers), derived from the token's exp.
 */
const secondsUntilExpiration = (token: string): number => {
  return Math.max(0, Math.floor((getTokenExpiration(token).getTime() - Date.now()) / 1000));
};

export const generateCookieOptionsToClear = (path: string = Strings.AuthCookiePath) => {
  /**
   * *** The below attributes +domain which is known here, are needed to identify the cookie from browser in order to be deleted. ***
   * *** If for some reason, you miss one of them, it might not be deleted, depending on the browser. ***
   */
  return {
    path: path,
    sameSite: 'strict' as SameSiteType,
    secure: true,
    httpOnly: true,
  };
};

export const generateCookieOptions = (token: string) => {
  const options = {
    signed: false, //refresh token is already signed
    httpOnly: true,
    sameSite: 'strict' as SameSiteType,
    secure: true,
    maxAge: secondsUntilExpiration(token),
    path: Strings.AuthCookiePath,
  };
  return options;
};

export const generateResetCookieOptions = (token: string) => {
  const options = {
    signed: false, //reset token is already signed
    httpOnly: true,
    sameSite: 'strict' as SameSiteType,
    secure: true,
    maxAge: secondsUntilExpiration(token),
    path: Strings.AuthCookiePath,
  };
  return options;
};
