import { EnvironmentVariables } from "../../constants/EnvironmentVariables";

type SameSiteType = boolean | "none" | "lax" | "strict" | undefined;

const cookieExpirationDays = Number(
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
    sameSite: "none" as SameSiteType,
    secure: EnvironmentVariables.IsProduction,
    expires: cookieExpirationDate, //for tabs compatibility
  };
  return options;
};

export const generateResetCookieOptions = (exp = resetCookieExpirationTime) => {
  const cookieExpirationDate = new Date(
    new Date().setDate(new Date().getDate() + exp / 1440) //converting minutes to days
  );

  console.log("cookie expiration time: ", cookieExpirationDate);
  const options = {
    signed: false, //refresh token is already signed
    httpOnly: true,
    sameSite: "none" as SameSiteType,
    secure: EnvironmentVariables.IsProduction,
    expires: cookieExpirationDate, //for tabs compatibility
  };
  return options;
};
