import { EnvironmentVariables } from "../../constants/EnvironmentVariables";

type SameSiteType = boolean | "none" | "lax" | "strict" | undefined;

const cookieExpirationDays = Number(
  String(EnvironmentVariables.Refresh_Token_Expiration_Time).replace(/\D/, "")
);

const socialCookieExpirationDays = Number(
  String(EnvironmentVariables.Refresh_Token_Expiration_Time).replace(/\D/, "")
);

const resetCookieExpirationTime = Number(
  String(EnvironmentVariables.Reset_Pass_Cookie_Expiration_Time).replace(
    /\D/,
    ""
  )
);

export const generateCookieOptions = () => {
  const cookieExpirationDate = new Date(
    new Date().setDate(new Date().getDate() + cookieExpirationDays)
  );

  const options = {
    signed: false, //refresh token is already signed
    httpOnly: true,
    sameSite: "lax" as SameSiteType,
    secure: true,
    expires: cookieExpirationDate, //for tabs compatibility
    path: "/",
  };
  return options;
};

export const generateSocialCookieOptions = () => {
  const cookieExpirationDate = new Date(
    new Date().setDate(new Date().getDate() + socialCookieExpirationDays)
  );

  const options = {
    signed: false, //social login token is already signed
    httpOnly: true,
    sameSite: "lax" as SameSiteType,
    secure: true,
    expires: cookieExpirationDate, //for tabs compatibility
    path: "/",
  };
  return options;
};

export const generateResetCookieOptions = () => {
  const cookieExpirationDate = new Date(
    new Date().setTime(new Date().getTime() + resetCookieExpirationTime * 60000)
  );

  const options = {
    signed: false, //reset token is already signed
    httpOnly: true,
    sameSite: "lax" as SameSiteType,
    secure: true,
    expires: cookieExpirationDate, //for tabs compatibility
  };
  return options;
};
