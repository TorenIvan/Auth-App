import { Resend } from 'resend';
import { EnvironmentVariables } from '../../constants/EnvironmentVariables';
import { Strings } from '../../constants/Strings';
import { logger } from './logger';

const resend = new Resend(EnvironmentVariables.Email_Api_Key);

export async function sendEmail(email: string, token: string, action: SendEmailAction) {
  let emailLink: string = EnvironmentVariables.Email_Verification_Uri;
  let emailSubject: string = Strings.VerificationEmailSubject;
  if (action === Strings.ActionResetPassword) {
    emailLink = EnvironmentVariables.Reset_Pass_Uri;
    emailSubject = Strings.ResetEmailSubject;
  }

  logger.debug(email);

  const mailOptions = {
    from: EnvironmentVariables.Email_Username,
    to: [email],
    subject: emailSubject,
    text: Strings.VerificationEmailText,
    html: `<p>Please, click <a href=${emailLink}?email=${email}&token=${token}>here</a> to ${action}</p>`,
  };

  const { error } = await resend.emails.send(mailOptions);
  if (error) {
    logger.error(error);
  }
}
