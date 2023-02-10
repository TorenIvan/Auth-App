import { EnvironmentVariables } from "../../constants/EnvironmentVariables";

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
    secure: EnvironmentVariables.IsProduction,
    expires: cookieExpirationDate, //for tabs compatibility
  };
  return options;
};

export const generateResetCookieOptions = () => {
  const cookieExpirationDate = new Date(
    new Date().setDate(new Date().getDate() + resetCookieExpirationTime)
  );

  const options = {
    signed: false, //refresh token is already signed
    httpOnly: true,
    secure: EnvironmentVariables.IsProduction,
    expires: cookieExpirationDate, //for tabs compatibility
  };
  return options;
};
