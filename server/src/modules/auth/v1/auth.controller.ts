import axios from 'axios';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ObjectId } from 'mongodb';
import { EnvironmentVariables } from '../../../config/utils/constants/EnvironmentVariables';
import { Errors } from '../../../config/utils/constants/Errors';
import { Strings } from '../../../config/utils/constants/Strings';
import {
  generateCookieOptions,
  generateCookieOptionsToClear,
  generateResetCookieOptions,
} from '../../../config/utils/helpers/auth/generateCookieOptions';
import {
  generateAuthJWTs,
  generateJWT,
  getTokenExpiration,
  verifyJWT,
} from '../../../config/utils/helpers/auth/generateJWTs';
import { sendEmail } from '../../../config/utils/helpers/general/sendEmail';
import {
  credentialsUserInput,
  forgotPasswordInput,
  oauthCodeInput,
  queryConfirmEmail,
  resetPasswordUserInput,
} from './auth.schema';
import {
  clearAuthCookies,
  hashToken,
  logger,
  retrieveRefreshToken,
} from '../../../config/utils/helpers';
import AuthService from './auth.service';

class AuthController {
  constructor(private authService: AuthService) {}

  private static handleError(reply: FastifyReply, errorCode: number, customError?: string) {
    let error;
    switch (errorCode) {
      case 403:
        error = customError ?? 'User is forbidden';
        break;
      case 401:
        error = customError ?? 'User is not authorized';
        break;
      case 500:
        error = customError ?? 'Internal server error';
        break;
      default:
        error = customError ?? 'Something went wrong, please try again later';
        break;
    }
    reply.code(errorCode).send(error);
  }

  /**
   * Provider errors carry the request config (client secret, code), so only the message is logged.
   */
  private static logProviderError(error: unknown) {
    logger.error({ message: (error as Error)?.message }, 'Social login failed');
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

  /**
   * @description Starts a new session (token family): its document id is the `sid` of both tokens,
   * the refresh token is stored hashed and sent as an httpOnly cookie, the access token in the body.
   */
  private async issueSession(
    request: FastifyRequest,
    reply: FastifyReply,
    userId: string,
    signInMethod: SignInMethod
  ) {
    const sessionId = new ObjectId();
    const { access_token, refresh_token } = generateAuthJWTs(
      userId,
      signInMethod,
      sessionId.toString()
    );

    const sessionCreated: ServiceResponseToken = await this.authService.CreateRefreshToken(
      sessionId,
      userId,
      hashToken(refresh_token),
      getTokenExpiration(refresh_token),
      request.ip,
      request.headers['user-agent'] || 'Unknown'
    );
    if (sessionCreated.success === false) {
      return AuthController.handleError(reply, 500, Errors.GenericError);
    }

    return reply
      .code(200)
      .setCookie(
        EnvironmentVariables.Cookie_Name,
        refresh_token,
        generateCookieOptions(refresh_token)
      )
      .send({ access_token: access_token });
  }

  /**
   * @description Finds or creates the user of a social profile whose email the provider has verified.
   * - Inactive users are forbidden.
   * - An unverified account with this email (possibly pre-registered by someone else) is claimed:
   *   it becomes verified and loses its password.
   */
  private async loginWithSocialProfile(
    request: FastifyRequest,
    reply: FastifyReply,
    email: string,
    name: string,
    biography: string,
    signInMethod: SignInMethod
  ) {
    const normalizedEmail: string = email.trim().toLowerCase();
    let userId: string;

    const existingUserResponse: ServiceResponse =
      await this.authService.FindUserByEmail(normalizedEmail);

    if (existingUserResponse.success === true) {
      const existingUser = existingUserResponse.data as ServiceInsertedData;

      if (existingUser.isActive !== true) {
        return AuthController.handleError(reply, 403);
      }
      if (existingUser.isVerified !== true) {
        const claimed: ServiceResponse = await this.authService.ClaimUnverifiedAccount(
          existingUser.userId.toString()
        );
        if (claimed.success === false) {
          return AuthController.handleError(reply, 500, Errors.GenericError);
        }
      }
      userId = existingUser.userId.toString();
    } else {
      const userSocialLoginResponse: ServiceResponse =
        await this.authService.InsertUserWithSocialAccount(
          name,
          normalizedEmail,
          biography,
          signInMethod
        );
      if (userSocialLoginResponse.success === false) {
        return AuthController.handleError(reply, 400, userSocialLoginResponse?.customError);
      }
      userId = userSocialLoginResponse.data!.userId.toString();
    }

    return this.issueSession(request, reply, userId, signInMethod);
  }

  async registerCredentialsHandler(
    request: FastifyRequest<{ Body: credentialsUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body;
      const serviceResponse: ServiceResponse = await this.authService.InsertUserWithCredentials(
        email.trim().toLowerCase(),
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
        request.query.email.trim().toLowerCase()
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

  async loginGithubHandler(request: FastifyRequest<{ Body: oauthCodeInput }>, reply: FastifyReply) {
    try {
      const { code } = request.body;

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
      const accessTokenGithub: string | undefined = tokenResponse.data?.access_token;
      if (!accessTokenGithub) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }
      const [userResponse, emailResponse] = await Promise.all([
        axios.get('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${accessTokenGithub}` },
        }),
        axios.get('https://api.github.com/user/emails', {
          headers: { Authorization: `Bearer ${accessTokenGithub}` },
        }),
      ]);

      // Only the primary email that GitHub has verified identifies the user
      const primaryEmailObj = Array.isArray(emailResponse.data)
        ? emailResponse.data.find((e) => e.primary && e.verified)
        : undefined;
      const email: string | undefined = primaryEmailObj?.email;
      if (!email || !userResponse.data.name) {
        return AuthController.handleError(reply, 400, Errors.NotRetrievedGithub);
      }

      return await this.loginWithSocialProfile(
        request,
        reply,
        email,
        userResponse.data.name,
        userResponse.data.about ?? '',
        'github'
      );
    } catch (error) {
      AuthController.logProviderError(error);
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async loginGoogleHandler(request: FastifyRequest<{ Body: oauthCodeInput }>, reply: FastifyReply) {
    try {
      const { code } = request.body;

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

      const accessTokenGoogle: string | undefined = tokenResponse.data?.access_token;
      if (!accessTokenGoogle) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }
      const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessTokenGoogle}` },
      });
      const email = userResponse.data?.email;
      const name = userResponse.data?.name ?? userResponse.data?.given_name;
      const isEmailVerified: boolean = userResponse.data?.verified_email === true;
      if (!email || !name || isEmailVerified === false) {
        return AuthController.handleError(reply, 400, Errors.NotRetrievedGoogle);
      }

      return await this.loginWithSocialProfile(request, reply, email, name, '', 'google');
    } catch (error) {
      AuthController.logProviderError(error);
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async loginDiscordHandler(
    request: FastifyRequest<{ Body: oauthCodeInput }>,
    reply: FastifyReply
  ) {
    try {
      const { code } = request.body;

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

      const accessTokenDiscord: string | undefined = tokenResponse.data?.access_token;
      if (!accessTokenDiscord) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }

      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessTokenDiscord}` },
      });

      const email = userResponse.data?.email;
      const name = userResponse.data?.username;
      const isEmailVerified: boolean = userResponse.data?.verified === true;

      if (!email || !name || isEmailVerified === false) {
        return AuthController.handleError(reply, 400, Errors.NotRetrievedDiscord);
      }

      return await this.loginWithSocialProfile(request, reply, email, name, '', 'discord');
    } catch (error) {
      AuthController.logProviderError(error);
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async loginGitlabHandler(request: FastifyRequest<{ Body: oauthCodeInput }>, reply: FastifyReply) {
    try {
      const { code } = request.body;

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

      const accessTokenGitlab: string | undefined = tokenResponse.data?.access_token;
      if (!accessTokenGitlab) {
        return AuthController.handleError(reply, 400, Errors.GenericError);
      }

      const userResponse = await axios.get('https://gitlab.com/api/v4/user', {
        headers: { Authorization: `Bearer ${accessTokenGitlab}` },
      });

      const email = userResponse.data?.email;
      const name = userResponse.data?.name || userResponse.data?.username;
      // confirmed_at is set once the GitLab account (its primary email) has been confirmed
      const isEmailVerified: boolean = !!userResponse.data?.confirmed_at;

      if (!email || !name || isEmailVerified === false) {
        return AuthController.handleError(reply, 400, Errors.NotRetrievedGitlab);
      }

      return await this.loginWithSocialProfile(request, reply, email, name, '', 'gitlab');
    } catch (error) {
      AuthController.logProviderError(error);
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
        email.trim().toLowerCase(),
        password
      );

      const credentialsAuthenticated: boolean = userCredsResponse.success;
      if (credentialsAuthenticated === false) {
        return AuthController.handleError(reply, 400, userCredsResponse?.customError);
      }

      const isUserActive: boolean = !!(userCredsResponse.data as ServiceInsertedData)?.isActive;
      if (!isUserActive) {
        return AuthController.handleError(reply, 403);
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

      return await this.issueSession(
        request,
        reply,
        userCredsResponse.data!.userId.toString(),
        'credentials'
      );
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
        email.trim().toLowerCase()
      );

      const emailExists: boolean = serviceResponse.success;

      const hasConfirmedEmail: ServiceResponse = await this.authService.CheckUserEmailConfirmation(
        email.trim().toLowerCase()
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

        reply
          .code(200)
          .setCookie(
            EnvironmentVariables.Reset_Pass_Cookie_Name,
            reset_password_cookie_token,
            generateResetCookieOptions(reset_password_cookie_token)
          );
      }

      reply.code(200).send();
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  /**
   * @description Refresh token rotation. The middleware has verified the cookie and found its session;
   * the service rotates it atomically. A token that is neither current nor in the grace window is an old
   * token of this family being reused: the whole session is revoked.
   */
  async renewTokens(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, signInMethod, refreshTokenId, refreshTokenHash } = request;
      const { access_token, refresh_token } = generateAuthJWTs(
        userId,
        signInMethod,
        refreshTokenId
      );

      const rotated: ServiceResponse = await this.authService.RotateRefreshToken(
        refreshTokenId,
        userId,
        refreshTokenHash,
        hashToken(refresh_token),
        getTokenExpiration(refresh_token),
        request.ip,
        request.headers['user-agent'] || 'Unknown'
      );

      if (rotated.success === false) {
        if (rotated.customError === Errors.RefreshTokenReused) {
          await this.authService.RevokeRefreshToken(refreshTokenId, userId);
          clearAuthCookies(reply);
          return AuthController.handleError(reply, 401);
        }
        return AuthController.handleError(reply, 500, Errors.GenericError);
      }

      reply
        .code(200)
        .setCookie(
          EnvironmentVariables.Cookie_Name,
          refresh_token,
          generateCookieOptions(refresh_token)
        )
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

      // The email link must belong to the user of the reset cookie that forgot-password set
      const isLinkOfCookieUser: boolean = userId === request.userId;
      if (isLinkOfCookieUser === false) {
        return AuthController.handleError(reply, 403, Errors.GenericErrorResetPassword);
      }

      const userExistsResponse: ServiceResponse =
        await this.authService.CheckUserIdExistence(userId);

      if (userExistsResponse.success === false) {
        return AuthController.handleError(reply, 403, Errors.GenericErrorResetPassword);
      }

      // Single use: a link issued before the last password change is no longer valid
      const passwordChangedAt: Date | undefined = (userExistsResponse.data as ServiceFoundData)
        .passwordChangedAt;
      const isLinkUsed: boolean =
        passwordChangedAt !== undefined &&
        (tokenVerifiedData.iat ?? 0) * 1000 < passwordChangedAt.getTime();
      if (isLinkUsed === true) {
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

      // Whoever had a session (possibly an attacker) is logged out everywhere
      const sessionsRevoked: ServiceResponse = await this.authService.RevokeAllUserSessions(userId);
      if (sessionsRevoked.success === false) {
        return AuthController.handleError(reply, 500, Errors.GenericError);
      }

      reply
        .code(200)
        .clearCookie(EnvironmentVariables.Reset_Pass_Cookie_Name, generateCookieOptionsToClear())
        .send();
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const refreshToken = retrieveRefreshToken(request.cookies);
      if (refreshToken) {
        try {
          const refreshTokenData = verifyJWT(
            refreshToken,
            EnvironmentVariables.Refresh_Token_Secret
          );
          // Only a session of the user of the access token can be revoked
          const isSessionOfUser: boolean = refreshTokenData.userId === request.userId;
          if (isSessionOfUser === true && refreshTokenData.sid) {
            await this.authService.RevokeRefreshToken(refreshTokenData.sid, request.userId);
          }
        } catch {
          // Invalid or expired cookie: there is no session to revoke, cookies are still cleared
        }
      }
      return clearAuthCookies(reply).code(200).send({ message: Strings.LoggedOut });
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  /**
   * @description Revokes every session of the user. Other devices keep their (stateless) access token
   * until it expires; their next refresh fails.
   */
  async logoutAllDevices(request: FastifyRequest, reply: FastifyReply) {
    try {
      const sessionsRevoked: ServiceResponse = await this.authService.RevokeAllUserSessions(
        request.userId
      );
      if (sessionsRevoked.success === false) {
        return AuthController.handleError(reply, 500, Errors.GenericError);
      }
      return clearAuthCookies(reply).code(200).send({ message: Strings.LoggedOutAllDevices });
    } catch (error) {
      AuthController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async checkIfUserIsAuthenticated(_: FastifyRequest, reply: FastifyReply) {
    // The isAuthenticated preHandler always replies; this only runs if that ever changes
    reply.code(200).send();
  }
}

export default AuthController;
