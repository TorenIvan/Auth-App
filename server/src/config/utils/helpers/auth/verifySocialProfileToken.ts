import axios from "axios";
import { EnvironmentVariables } from "../../constants/EnvironmentVariables";
import { retrieveSocialProfileToken } from "./retrieveSocialProfileToken";

async function verifySocialProfileToken(
  cookies: {
    [cookieName: string]: string | undefined;
  },
  signInMethod: SignInMethod
): Promise<void> {
  if (signInMethod === "credentials") return;

  const socialProfileToken = retrieveSocialProfileToken(cookies) ?? "";
  if (!socialProfileToken) {
    throw new Error("Token not exist for social profile. Unauthorized");
  }

  switch (signInMethod) {
    case "facebook": {
      const tokenVerifyInfo = await axios.get(
        `https://graph.facebook.com/debug_token?input_token=${socialProfileToken}&access_token=${socialProfileToken}`,
        { headers: { Origin: EnvironmentVariables.ServerUri } }
      );

      if (!tokenVerifyInfo?.data?.data?.is_valid) {
        throw new Error("Token is invalid. Unauthorized");
      }

      if (
        tokenVerifyInfo.data.data.app_id !==
        EnvironmentVariables.Facebook_App_Id
      ) {
        throw new Error("Token has invalid app_id. Unauthorized");
      }
      break;
    }
    case "twitter":
    case "google":
    case "github":
    default: {
      throw new Error("No known sign-in method found. Unauthorized");
    }
  }
}

export { verifySocialProfileToken };
