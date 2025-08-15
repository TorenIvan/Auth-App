import { Resend } from "resend";
import { EnvironmentVariables } from "../../constants/EnvironmentVariables";
import { Strings } from "../../constants/Strings";
import { logger } from "./logger";

const resend = new Resend(EnvironmentVariables.Email_Api_Key);

export async function sendEmail(
  email: string,
  token: string,
  action: SendEmailAction
) {
  let emailLink = EnvironmentVariables.Email_Verification_Uri;
  if (action === Strings.ActionResetPassword) {
    emailLink = EnvironmentVariables.Reset_Pass_Uri;
  }

logger.debug(email);

  const mailOptions = {
    from: EnvironmentVariables.Email_Username,
    to: email,
    subject: Strings.VerificationEmailSubject,
    text: Strings.VerificationEmailText,
    html: `<p>Please, click <a href=${emailLink}?email=${email}&token=${token}>here</a> to ${action}</p>`,
  };

   const { error } = await resend.emails.send(mailOptions);
   if (error) {
    logger.error(error);
   }
}
