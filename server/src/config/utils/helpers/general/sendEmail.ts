import { createTransport } from "nodemailer";
import SMTPConnection = require("nodemailer/lib/smtp-connection");
import { EnvironmentVariables } from "../../constants/EnvironmentVariables";
import { Strings } from "../../constants/Strings";

const transportAuthenticationObject: SMTPConnection.AuthenticationType = {
  user: EnvironmentVariables.Email_Username,
  pass: EnvironmentVariables.Email_Password,
};

const transportOptions: SMTPConnection.Options = {
  host: EnvironmentVariables.Email_Host,
  port: Number(EnvironmentVariables.Email_Port),
  secure: false,
  auth: transportAuthenticationObject,
  logger: EnvironmentVariables.IsProduction === false,
  debug: EnvironmentVariables.IsProduction === false,
};

export async function sendEmail(
  email: string,
  token: string,
  action: SendEmailAction
) {
  const transporter = createTransport(transportOptions);

  let emailLink = EnvironmentVariables.Email_Verification_Uri;
  if (action === Strings.ActionResetPassword) {
    emailLink = EnvironmentVariables.Reset_Pass_Uri;
  }

  const mailOptions = {
    from: EnvironmentVariables.Email_Username,
    to: email,
    subject: Strings.VerificationEmailSubject,
    text: Strings.VerificationEmailText,
    html: `<p>Please, click <a href=${emailLink}token=${token}>here</a> to ${action}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
}
