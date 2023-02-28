import { EnvironmentVariables } from "../../constants/EnvironmentVariables";

const retrieveRefreshToken = (cookies: {
  [cookieName: string]: string | undefined;
}) => {
  let refreshToken: string | null = null;
  let requestCookiesExist: boolean = false;

  const authCookieName = EnvironmentVariables.Cookie_Name;

  if (cookies !== null && cookies !== undefined) {
    requestCookiesExist = true;
  }
  if (requestCookiesExist === true) {
    refreshToken = cookies[authCookieName] ?? null;
  }

  return refreshToken;
};

export { retrieveRefreshToken };
