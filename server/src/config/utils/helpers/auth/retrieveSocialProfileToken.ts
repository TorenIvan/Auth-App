import { EnvironmentVariables } from '../../constants/EnvironmentVariables';

const retrieveSocialProfileToken = (cookies: { [cookieName: string]: string | undefined }) => {
  let socialProfileToken: string | null = null;
  let requestCookiesExist: boolean = false;

  const authCookieName = EnvironmentVariables.Cookie_Name_Social_Profile;

  if (cookies !== null && cookies !== undefined) {
    requestCookiesExist = true;
  }
  if (requestCookiesExist === true) {
    socialProfileToken = cookies[authCookieName] ?? null;
  }

  return socialProfileToken;
};

export { retrieveSocialProfileToken };
