import { FastifyReply, FastifyRequest } from 'fastify';
import { EnvironmentVariables } from '../../../config/utils/constants/EnvironmentVariables';
import { Errors } from '../../../config/utils/constants/Errors';
import { Strings } from '../../../config/utils/constants/Strings';
import {
  generateCookieOptions,
  generateCookieOptionsToClear,
  generateResetCookieOptions,
  generateSocialCookieOptions,
} from '../../../config/utils/helpers/auth/generateCookieOptions';
import {
  generateAuthJWTs,
  generateJWT,
  verifyJWT,
} from '../../../config/utils/helpers/auth/generateJWTs';
import { sendEmail } from '../../../config/utils/helpers/general/sendEmail';
import {
  credentialsUserInput,
  forgotPasswordInput,
  queryConfirmEmail,
  resetPasswordUserInput,
} from './auth.schema';
import AuthService from './auth.service';
import axios from 'axios';
import { logger } from '../../../config/utils/helpers';

class AuthController {
  constructor(private authService: AuthService) {}

  private static handleError(reply: FastifyReply, errorCode: number, customError?: string) {
    let error;
    switch (errorCode) {
      case 403:
        error = customError ?? 'Forbidden';
        break;
      case 401:
        error = customError ?? 'Unauthorized';
        break;
      case 500:
        error = customError ?? 'Internal server error';
        break;
      default:
        error = customError ?? 'Invalid request';
        break;
    }
    reply.code(errorCode).send(error);
  }

  private static verifyQueryToken(query: { token?: string }): TokenInterface | null {
    try {
      const token = query.token;
      if (!token) throw new Error('Invalid token');

      const data = verifyJWT(token!, EnvironmentVariables.Email_Secret);
      if (!data?.userId || !data?.type) throw new Error('Invalid token data');

      return data;
    } catch (error) {
      return null;
    }
  }

  async registerCredentialsHandler(
    request: FastifyRequest<{ Body: credentialsUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body;
      const serviceResponse: ServiceResponse = await this.authService.InsertUserWithCredentials(
        email.toLowerCase(),
        password
      );

      const insertedCorrectly: boolean = serviceResponse.success;
      if (insertedCorrectly === false) {
        return AuthController.handleError(reply, 400, serviceResponse?.customError);
      }

      const email_token = generateJWT(
        {
          userId: serviceResponse.data!.userId.toString(),
          type: Strings.ConfirmEmailType,
        },
        EnvironmentVariables.Email_Secret,
        EnvironmentVariables.Email_Token_Expiration_Time
      );

      sendEmail(email, email_token, Strings.ActionConfirmEmail);
      reply.code(201).send();
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async confirmEmailHandler(
    request: FastifyRequest<{ Querystring: queryConfirmEmail }>,
    reply: FastifyReply
  ) {
    try {
      const tokenVerifiedData = AuthController.verifyQueryToken(request.query);
      if (tokenVerifiedData === null) {
        return AuthController.handleError(reply, 400, Errors.TokenExpired);
      }

      const hasConfirmedEmail: ServiceResponse = await this.authService.CheckUserEmailConfirmation(
        request.query.email.toLowerCase()
      );

      if (hasConfirmedEmail.success === false) {
        const { userId, type } = tokenVerifiedData;
        if (type !== Strings.ConfirmEmailType) {
          return AuthController.handleError(reply, 400, Errors.IncorrectToken);
        }

        const serviceResponse: ServiceResponse =
          await this.authService.UpdateIsVerifiedWhenUserExists(userId);

        const doneVerified: boolean = serviceResponse.success;
        if (doneVerified === false) {
          return AuthController.handleError(reply, 400, serviceResponse?.customError);
        }
      }
      reply.code(200).send();
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async loginFacebookHandler(
    request: FastifyRequest<{ Body: { code: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { code } = request.body;
      logger.debug(code);

      if (!code) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }

      const fbRetrieveTokenUri = `https://graph.facebook.com/v23.0/oauth/access_token?client_id=${EnvironmentVariables.Facebook_App_Id}&redirect_uri=${encodeURIComponent(EnvironmentVariables.Facebook_App_Redirect_Uri)}&client_secret=${EnvironmentVariables.Facebook_App_Secret}&code=${code}`;

      const tokenResponse = await axios.get(fbRetrieveTokenUri, {
        headers: {
          Origin: EnvironmentVariables.ServerUri,
        },
      });
      logger.debug(tokenResponse?.data?.access_token);

      if (!tokenResponse?.data?.access_token) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }

      const userResponse = await axios.get(
        `https://graph.facebook.com/me?fields=id,email,name,about&access_token=${tokenResponse.data.access_token}`,
        {
          headers: { Origin: EnvironmentVariables.ServerUri },
        }
      );
      logger.debug({ data: userResponse?.data });

      if (!userResponse?.data?.email || !userResponse?.data?.name) {
        return AuthController.handleError(reply, 400, Errors.NotRetrievedFacebook);
      }

      let userId: string | undefined = undefined;
      const checkIfEmailExists: ServiceResponse = await this.authService.CheckEmailExistence(
        userResponse.data.email.trim().toLowerCase()
      );

      logger.debug('Email ', userResponse.data.email, ' exists: ', checkIfEmailExists.success);

      const givenSocialPlatformEmailExist: boolean = checkIfEmailExists.success;
      if (givenSocialPlatformEmailExist === true) {
        userId = checkIfEmailExists.data!.userId.toString();
      }

      /**
       * Start of register user operation
       */
      if (givenSocialPlatformEmailExist === false) {
        const userSocialLoginResponse: ServiceResponse =
          await this.authService.InsertUserWithSocialAccount(
            userResponse.data.name,
            userResponse.data.email.trim().toLowerCase(),
            userResponse.data.about ?? '',
            'facebook'
          );

        const inserted: boolean = userSocialLoginResponse.success;
        if (inserted === false) {
          return AuthController.handleError(reply, 400, userSocialLoginResponse?.customError);
        }
        userId = userSocialLoginResponse.data!.userId.toString();
      }
      const cookieOptions = generateSocialCookieOptions();

      logger.debug('UserId ', userId);
      const { access_token, refresh_token } = generateAuthJWTs(userId!, 'facebook');
      await this.authService.updateUserRefreshTokenById(userId!, refresh_token);

      reply
        .code(200)
        .setCookie(EnvironmentVariables.Cookie_Name, refresh_token, cookieOptions)
        .setCookie(
          EnvironmentVariables.Cookie_Name_Social_Profile,
          tokenResponse.data.access_token,
          cookieOptions
        )
        .send({ access_token: access_token });
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async loginGithubHandler(
    request: FastifyRequest<{ Body: { code: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { code } = request.body;
      logger.debug({ code });

      if (!code) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }

      const githubTokenUri = 'https://github.com/login/oauth/access_token';
      const params = {
        client_id: EnvironmentVariables.Github_App_Id,
        client_secret: EnvironmentVariables.Github_App_Secret,
        code,
        redirect_uri: EnvironmentVariables.Github_App_Redirect_Uri,
      };

      const tokenResponse = await axios.post(githubTokenUri, params, {
        headers: { Accept: 'application/json' },
      });
      logger.debug({ tokenResponse });

      const accessTokenGithub: string | undefined = tokenResponse.data?.access_token;
      if (!accessTokenGithub) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }
      logger.debug({ accessTokenGithub });

      const [userResponse, emailResponse] = await Promise.all([
        axios.get('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${accessTokenGithub}` },
        }),
        axios.get('https://api.github.com/user/emails', {
          headers: { Authorization: `Bearer ${accessTokenGithub}` },
        }),
      ]);
      logger.debug({ userResponse, emailResponse });

      // Find primary, verified email
      const primaryEmailObj = Array.isArray(emailResponse.data)
        ? emailResponse.data.find((e) => e.primary && e.verified)
        : undefined;
      const email = primaryEmailObj?.email || userResponse.data.email;
      logger.debug({ email });

      if (!email || !userResponse.data.name) {
        return AuthController.handleError(reply, 400, Errors.NotRetrievedGithub);
      }
      let userId: string | undefined = undefined;
      const checkIfEmailExists: ServiceResponse = await this.authService.CheckEmailExistence(
        email.trim().toLowerCase()
      );

      logger.debug('Email ', userResponse.data.email, ' exists: ', checkIfEmailExists.success);

      const givenSocialPlatformEmailExist: boolean = checkIfEmailExists.success;
      if (givenSocialPlatformEmailExist === true) {
        userId = checkIfEmailExists.data!.userId.toString();
      }

      /**
       * Start of register user operation
       */
      if (givenSocialPlatformEmailExist === false) {
        const userSocialLoginResponse: ServiceResponse =
          await this.authService.InsertUserWithSocialAccount(
            userResponse.data.name,
            email.trim().toLowerCase(),
            userResponse.data.about ?? '',
            'github'
          );

        const inserted: boolean = userSocialLoginResponse.success;
        if (inserted === false) {
          return AuthController.handleError(reply, 400, userSocialLoginResponse?.customError);
        }
        userId = userSocialLoginResponse.data!.userId.toString();
      }
      const cookieOptions = generateSocialCookieOptions();

      const { access_token, refresh_token } = generateAuthJWTs(userId!, 'github');
      await this.authService.updateUserRefreshTokenById(userId!, refresh_token);

      reply
        .code(200)
        .setCookie(EnvironmentVariables.Cookie_Name, refresh_token, cookieOptions)
        .setCookie(
          EnvironmentVariables.Cookie_Name_Social_Profile,
          accessTokenGithub,
          cookieOptions
        )
        .send({ access_token: access_token });
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async loginGoogleHandler(
    request: FastifyRequest<{ Body: { code: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { code } = request.body;
      logger.debug({ code });

      if (!code) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }

      const googleTokenUri = 'https://oauth2.googleapis.com/token';
      const params = {
        code,
        client_id: EnvironmentVariables.Google_App_Id,
        client_secret: EnvironmentVariables.Google_App_Secret,
        redirect_uri: EnvironmentVariables.Google_App_Redirect_Uri,
        grant_type: 'authorization_code',
      };

      const tokenResponse = await axios.post(googleTokenUri, new URLSearchParams(params), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      logger.debug({ tokenResponse: tokenResponse.data });

      const accessTokenGoogle: string | undefined = tokenResponse.data?.access_token;
      if (!accessTokenGoogle) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }
      logger.debug({ accessTokenGoogle });

      const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessTokenGoogle}` },
      });
      logger.debug({ userResponse: userResponse.data });

      const email = userResponse.data?.email;
      const name = userResponse.data?.name ?? userResponse.data?.given_name;
      if (!email || !name) {
        return AuthController.handleError(reply, 400, Errors.NotRetrievedGoogle);
      }

      let userId: string | undefined = undefined;
      const checkIfEmailExists: ServiceResponse = await this.authService.CheckEmailExistence(
        email.trim().toLowerCase()
      );

      logger.debug('Email ', email, ' exists: ', checkIfEmailExists.success);

      if (checkIfEmailExists.success) {
        userId = checkIfEmailExists.data!.userId.toString();
      } else {
        const userSocialLoginResponse: ServiceResponse =
          await this.authService.InsertUserWithSocialAccount(
            name,
            email.trim().toLowerCase(),
            '',
            'google'
          );

        if (!userSocialLoginResponse.success) {
          return AuthController.handleError(reply, 400, userSocialLoginResponse?.customError);
        }
        userId = userSocialLoginResponse.data!.userId.toString();
      }

      const cookieOptions = generateSocialCookieOptions();
      const { access_token, refresh_token } = generateAuthJWTs(userId!, 'google');
      await this.authService.updateUserRefreshTokenById(userId!, refresh_token);

      reply
        .code(200)
        .setCookie(EnvironmentVariables.Cookie_Name, refresh_token, cookieOptions)
        .setCookie(
          EnvironmentVariables.Cookie_Name_Social_Profile,
          accessTokenGoogle,
          cookieOptions
        )
        .send({ access_token: access_token });
    } catch (error) {
      logger.error(error);
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async loginDiscordHandler(
    request: FastifyRequest<{ Body: { code: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { code } = request.body;
      logger.debug({ code });

      if (!code) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }

      const discordTokenUri = 'https://discord.com/api/oauth2/token';
      const params = new URLSearchParams({
        client_id: EnvironmentVariables.Discord_App_Id,
        client_secret: EnvironmentVariables.Discord_App_Secret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: EnvironmentVariables.Discord_App_Redirect_Uri,
      });

      const tokenResponse = await axios.post(discordTokenUri, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      logger.debug({ tokenResponse: tokenResponse.data });

      const accessTokenDiscord: string | undefined = tokenResponse.data?.access_token;
      if (!accessTokenDiscord) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }

      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessTokenDiscord}` },
      });

      logger.debug({ userResponse: userResponse.data });

      const email = userResponse.data?.email;
      const name = userResponse.data?.username;

      if (!email || !name) {
        return AuthController.handleError(reply, 400, Errors.NotRetrievedDiscord);
      }

      let userId: string | undefined = undefined;
      const checkIfEmailExists: ServiceResponse = await this.authService.CheckEmailExistence(
        email.trim().toLowerCase()
      );

      logger.debug('Email ', email, ' exists: ', checkIfEmailExists.success);

      if (checkIfEmailExists.success) {
        userId = checkIfEmailExists.data!.userId.toString();
      } else {
        const userSocialLoginResponse: ServiceResponse =
          await this.authService.InsertUserWithSocialAccount(
            name,
            email.trim().toLowerCase(),
            '',
            'discord'
          );

        if (!userSocialLoginResponse.success) {
          return AuthController.handleError(reply, 400, userSocialLoginResponse?.customError);
        }

        userId = userSocialLoginResponse.data!.userId.toString();
      }

      const cookieOptions = generateSocialCookieOptions();
      const { access_token, refresh_token } = generateAuthJWTs(userId!, 'discord');
      await this.authService.updateUserRefreshTokenById(userId!, refresh_token);

      reply
        .code(200)
        .setCookie(EnvironmentVariables.Cookie_Name, refresh_token, cookieOptions)
        .setCookie(
          EnvironmentVariables.Cookie_Name_Social_Profile,
          accessTokenDiscord,
          cookieOptions
        )
        .send({ access_token });
    } catch (error) {
      logger.error(error);
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async loginGitlabHandler(
    request: FastifyRequest<{ Body: { code: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { code } = request.body;
      logger.debug({ code });

      if (!code) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }

      // Exchange code for access token
      const gitlabTokenUri = 'https://gitlab.com/oauth/token';
      const params = new URLSearchParams({
        client_id: EnvironmentVariables.Gitlab_App_Id,
        client_secret: EnvironmentVariables.Gitlab_App_Secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: EnvironmentVariables.Gitlab_App_Redirect_Uri,
      });

      const tokenResponse = await axios.post(gitlabTokenUri, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      logger.debug({ tokenResponse: tokenResponse.data });

      const accessTokenGitlab: string | undefined = tokenResponse.data?.access_token;
      if (!accessTokenGitlab) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }

      // Get GitLab user info
      const userResponse = await axios.get('https://gitlab.com/api/v4/user', {
        headers: { Authorization: `Bearer ${accessTokenGitlab}` },
      });

      logger.debug({ userResponse: userResponse.data });

      const email = userResponse.data?.email;
      const name = userResponse.data?.name || userResponse.data?.username;

      if (!email || !name) {
        return AuthController.handleError(reply, 400, Errors.NotRetrievedGitlab);
      }

      // Check if user exists in your DB
      let userId: string | undefined = undefined;
      const checkIfEmailExists: ServiceResponse = await this.authService.CheckEmailExistence(
        email.trim().toLowerCase()
      );

      logger.debug('Email ', email, ' exists: ', checkIfEmailExists.success);

      if (checkIfEmailExists.success) {
        userId = checkIfEmailExists.data!.userId.toString();
      } else {
        const userSocialLoginResponse: ServiceResponse =
          await this.authService.InsertUserWithSocialAccount(
            name,
            email.trim().toLowerCase(),
            '',
            'gitlab'
          );

        if (!userSocialLoginResponse.success) {
          return AuthController.handleError(reply, 400, userSocialLoginResponse?.customError);
        }

        userId = userSocialLoginResponse.data!.userId.toString();
      }

      // Generate JWTs and set cookies
      const cookieOptions = generateSocialCookieOptions();
      const { access_token, refresh_token } = generateAuthJWTs(userId!, 'gitlab');
      await this.authService.updateUserRefreshTokenById(userId!, refresh_token);

      reply
        .code(200)
        .setCookie(EnvironmentVariables.Cookie_Name, refresh_token, cookieOptions)
        .setCookie(
          EnvironmentVariables.Cookie_Name_Social_Profile,
          accessTokenGitlab,
          cookieOptions
        )
        .send({ access_token });
    } catch (error) {
      logger.error(error);
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async loginCredentialsHandler(
    request: FastifyRequest<{ Body: credentialsUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body;

      const userCredsResponse: ServiceResponse = await this.authService.ValidateUserWithCredentials(
        email.toLowerCase(),
        password
      );

      const credentialsAuthenticated: boolean = userCredsResponse.success;
      if (credentialsAuthenticated === false) {
        return AuthController.handleError(reply, 400, userCredsResponse?.customError);
      }

      const hasConfirmedEmail: boolean | null | undefined = (
        userCredsResponse.data as ServiceInsertedData
      )?.isVerified;

      if (hasConfirmedEmail === false) {
        const new_email_token = generateJWT(
          {
            userId: userCredsResponse.data!.userId.toString(),
            type: Strings.ConfirmEmailType,
          },
          EnvironmentVariables.Email_Secret,
          EnvironmentVariables.Email_Token_Expiration_Time
        );

        sendEmail(email, new_email_token, Strings.ActionConfirmEmail);

        return AuthController.handleError(reply, 403, Errors.ConfirmEmailInOrderToContinue);
      }

      const { access_token, refresh_token } = generateAuthJWTs(
        userCredsResponse.data!.userId.toString()
      );
      await this.authService.updateUserRefreshToken(email.toLowerCase(), refresh_token);

      const cookieOptions = generateCookieOptions();

      reply
        .code(200)
        .setCookie(EnvironmentVariables.Cookie_Name, refresh_token, cookieOptions)
        .send({ access_token: access_token });
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async forgotPasswordHandler(
    request: FastifyRequest<{ Body: forgotPasswordInput }>,
    reply: FastifyReply
  ) {
    try {
      const { email } = request.body;

      const serviceResponse: ServiceResponse = await this.authService.CheckEmailExistence(
        email.toLowerCase()
      );

      const emailExists: boolean = serviceResponse.success;

      const hasConfirmedEmail: ServiceResponse = await this.authService.CheckUserEmailConfirmation(
        email.toLowerCase()
      );

      const emailConfirmed: boolean = hasConfirmedEmail.success;

      if (emailExists === true && emailConfirmed === true) {
        const new_email_token = generateJWT(
          {
            userId: serviceResponse.data!.userId.toString(),
            type: Strings.ForgotPasswordType,
          },
          EnvironmentVariables.Email_Secret,
          EnvironmentVariables.Email_Token_Expiration_Time
        );

        sendEmail(email, new_email_token, Strings.ActionResetPassword);

        const reset_password_cookie_token = generateJWT(
          {
            userId: serviceResponse.data!.userId.toString(),
            type: Strings.ForgotPasswordType,
          },
          EnvironmentVariables.Reset_Pass_Cookie_Secret,
          EnvironmentVariables.Reset_Pass_Cookie_Expiration_Time
        );

        const cookieOptions = generateResetCookieOptions();

        reply
          .code(200)
          .setCookie(
            EnvironmentVariables.Reset_Pass_Cookie_Name,
            reset_password_cookie_token,
            cookieOptions
          );
      }

      reply.code(200).send();
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async renewTokens(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, signInMethod } = request;

      const { access_token, refresh_token } = generateAuthJWTs(userId, signInMethod);
      await this.authService.updateUserRefreshTokenById(userId, refresh_token);

      const cookieOptions = generateCookieOptions();

      reply
        .code(200)
        .setCookie(EnvironmentVariables.Cookie_Name, refresh_token, cookieOptions)
        .send({ access_token: access_token });
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async resetPasswordHandler(
    request: FastifyRequest<{
      Querystring: queryConfirmEmail;
      Body: resetPasswordUserInput;
    }>,
    reply: FastifyReply
  ) {
    try {
      const tokenVerifiedData = AuthController.verifyQueryToken(request.query);
      if (tokenVerifiedData === null) {
        return AuthController.handleError(reply, 403, Errors.GenericErrorResetPassword);
      }

      const { userId, type } = tokenVerifiedData;
      if (type !== Strings.ForgotPasswordType) {
        return AuthController.handleError(reply, 403, Errors.IncorrectResetToken);
      }
      const userExistsResponse: ServiceResponse =
        await this.authService.CheckUserIdExistence(userId);

      if (userExistsResponse.success === false) {
        return AuthController.handleError(reply, 403, Errors.GenericErrorResetPassword);
      }

      const { newPassword, confirmNewPassword } = request.body;
      if (newPassword !== confirmNewPassword) {
        return AuthController.handleError(reply, 400, Errors.PasswordsNotSame);
      }
      const resetPasswordById: ServiceResponse = await this.authService.ResetPassword(
        userId,
        newPassword
      );

      if (resetPasswordById.success === false) {
        return AuthController.handleError(reply, 400, Errors.GenericErrorResetPassword);
      }

      reply
        .code(200)
        .clearCookie(
          EnvironmentVariables.Reset_Pass_Cookie_Name,
          generateCookieOptionsToClear(true)
        );
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async logout(_: FastifyRequest, reply: FastifyReply) {
    return reply
      .code(200)
      .clearCookie(EnvironmentVariables.Cookie_Name, generateCookieOptionsToClear())
      .clearCookie(EnvironmentVariables.Cookie_Name_Social_Profile, generateCookieOptionsToClear())
      .send({ message: 'Logged out successfully' });
  }

  async checkIfUserIsAuthenticated(_: FastifyRequest, reply: FastifyReply) {
    reply.code(403).send();
  }
}

export default AuthController;
