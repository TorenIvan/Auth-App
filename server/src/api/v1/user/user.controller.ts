import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { EnvironmentVariables } from "../../../config/utils/constants/EnvironmentVariables";
import { Errors } from "../../../config/utils/constants/Errors";
import { Strings } from "../../../config/utils/constants/Strings";
import {
  generateCookieOptions,
  generateResetCookieOptions,
} from "../../../config/utils/helpers/auth/generateCookieOptions";
import {
  generateAuthJWTs,
  generateJWT,
  verifyJWT,
} from "../../../config/utils/helpers/auth/generateJWTs";
import { sendEmail } from "../../../config/utils/helpers/general/sendEmail";
import {
  credsUserInput,
  editUserDetailsBody,
  forgotPasswordInput,
  queryConfirmEmail,
  resetPasswordUserInput,
} from "./user.schema";
import UserService from "./user.service";

/**
 * Keeps all the "bussiness" logic of User Collection
 * ToDos:
 * 1) Add a way  to check access and refresh tokens
 */
class UserController {
  private static instance: InstanceType<typeof UserController>;
  private static userService: InstanceType<typeof UserService>;
  private static fastifyInstance: FastifyInstance;

  constructor(fastifyInstance: FastifyInstance) {
    if (UserController.instance === undefined) {
      UserController.instance = this;
      UserController.fastifyInstance = fastifyInstance;
      UserController.userService = new UserService(fastifyInstance.User);
    }
    return UserController.instance;
  }

  static handleError(
    reply: FastifyReply,
    errorCode: number,
    customError?: string
  ) {
    let error;
    if (customError !== undefined) {
      switch (errorCode) {
        case 403:
          error =
            UserController.fastifyInstance.httpErrors.forbidden(customError);
          break;
        case 401:
          error =
            UserController.fastifyInstance.httpErrors.unauthorized(customError);
          break;
        case 500:
          error =
            UserController.fastifyInstance.httpErrors.internalServerError(
              customError
            );
          break;
        default:
          error =
            UserController.fastifyInstance.httpErrors.badRequest(customError);
          break;
      }
    } else {
      switch (errorCode) {
        case 403:
          error = UserController.fastifyInstance.httpErrors.forbidden();
          break;
        case 401:
          error = UserController.fastifyInstance.httpErrors.unauthorized();
          break;
        case 500:
          error =
            UserController.fastifyInstance.httpErrors.internalServerError();
          break;
        default:
          error = UserController.fastifyInstance.httpErrors.badRequest();
          break;
      }
    }
    reply.code(errorCode).send(error);
    return;
  }

  /**
   * This could be made as an Auth Middleware
   **/
  static verifyQueryToken(query: { token?: string }): TokenInterface | null {
    try {
      const token = query.token;
      if (!token) throw new Error("Invalid token");

      const data = verifyJWT(token!, EnvironmentVariables.Email_Secret);
      if (!data?.userId || !data?.type) throw new Error("Invalid token data");

      return data;
    } catch (error) {
      return null;
    }
  }

  async registerCredentialsHandler(
    request: FastifyRequest<{ Body: credsUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body;

      const serviceResponse: ServiceResponse =
        await UserController.userService.InsertUserWithCredentials(
          email,
          password.trim()
        );

      const insertedCorrectly: boolean = serviceResponse.success;
      if (insertedCorrectly === false) {
        return UserController.handleError(
          reply,
          400,
          serviceResponse?.customError
        );
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

      reply.code(201);
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async confirmEmailHandler(
    request: FastifyRequest<{ Querystring: queryConfirmEmail }>,
    reply: FastifyReply
  ) {
    try {
      const tokenVerifiedData = UserController.verifyQueryToken(request.query);
      if (tokenVerifiedData === null) {
        return UserController.handleError(reply, 401, Errors.TokenExpired);
      }

      const { userId, type } = tokenVerifiedData;
      if (type !== Strings.ConfirmEmailType) {
        return UserController.handleError(reply, 401, Errors.IncorrectToken);
      }

      const serviceResponse: ServiceResponse =
        await UserController.userService.UpdateIsVerifiedWhenUserExists(userId);

      const doneVerified: boolean = serviceResponse.success;
      if (doneVerified === false) {
        return UserController.handleError(
          reply,
          400,
          serviceResponse?.customError
        );
      }
      reply.code(200);
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async loginCredentialsHandler(
    request: FastifyRequest<{ Body: credsUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body;

      const userCredsResponse: ServiceResponse =
        await UserController.userService.ValidateUserWithCredentials(
          email,
          password.trim()
        );

      const credentialsAuthenticated: boolean = userCredsResponse.success;
      if (credentialsAuthenticated === false) {
        return UserController.handleError(
          reply,
          400,
          userCredsResponse?.customError
        );
      }

      const hasConfirmedEmail: ServiceResponse =
        await UserController.userService.CheckUserEmailConfirmation(email);

      if (hasConfirmedEmail.success === false) {
        const new_email_token = generateJWT(
          {
            userId: userCredsResponse.data!.userId.toString(),
            type: Strings.ConfirmEmailType,
          },
          EnvironmentVariables.Email_Secret,
          EnvironmentVariables.Email_Token_Expiration_Time
        );

        sendEmail(email, new_email_token, Strings.ActionConfirmEmail);

        return UserController.handleError(
          reply,
          403,
          Errors.ConfirmEmailInOrderToContinue
        );
      }

      const { access_token, refresh_token } = generateAuthJWTs(
        userCredsResponse.data!.userId.toString()
      );

      const cookieOptions = generateCookieOptions();

      reply
        .code(200)
        .setCookie(
          EnvironmentVariables.Cookie_Name,
          refresh_token,
          cookieOptions
        )
        .send({ access_token: access_token });
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async forgotPasswordHandler(
    request: FastifyRequest<{ Body: forgotPasswordInput }>,
    reply: FastifyReply
  ) {
    try {
      const { email } = request.body;

      const serviceResponse: ServiceResponse =
        await UserController.userService.CheckEmailExistence(email);

      const emailExists: boolean = serviceResponse.success;

      const hasConfirmedEmail: ServiceResponse =
        await UserController.userService.CheckUserEmailConfirmation(email);

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

      reply.code(200);
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async renewTokens(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, signInMethod } = request;

      const { access_token, refresh_token } = generateAuthJWTs(
        userId,
        signInMethod
      );

      const cookieOptions = generateCookieOptions();

      reply
        .code(200)
        .setCookie(
          EnvironmentVariables.Cookie_Name,
          refresh_token,
          cookieOptions
        )
        .send({ access_token: access_token });
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
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
      const tokenVerifiedData = UserController.verifyQueryToken(request.query);
      if (tokenVerifiedData === null) {
        return UserController.handleError(reply, 401, Errors.TokenExpired);
      }

      const { userId, type } = tokenVerifiedData;
      if (type !== Strings.ForgotPasswordType) {
        return UserController.handleError(reply, 401, Errors.IncorrectToken);
      }
      const userExistsResponse: ServiceResponse =
        await UserController.userService.CheckUserIdExistence(userId);

      if (userExistsResponse.success === false) {
        return UserController.handleError(
          reply,
          401,
          Errors.GenericErrorResetPassword
        );
      }

      const { newPassword, confirmNewPassword } = request.body;
      if (newPassword !== confirmNewPassword) {
        return UserController.handleError(reply, 400, Errors.PasswordsNotSame);
      }
      const resetPasswordById: ServiceResponse =
        await UserController.userService.ResetPassword(userId, newPassword);

      if (resetPasswordById.success === false) {
        return UserController.handleError(
          reply,
          400,
          Errors.GenericErrorResetPassword
        );
      }

      reply.code(200).clearCookie(EnvironmentVariables.Reset_Pass_Cookie_Name, {
        path: "/v1/auth",
      });
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async retrieveUserDetails(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userDetails: ServiceResponse =
        await UserController.userService.RetrieveUserDetails(
          request.userId ?? ""
        );

      if (userDetails.success === false) {
        return UserController.handleError(reply, 400, userDetails?.customError);
      }

      const { username, email, phone, biography, signInMethod } =
        userDetails.data as ServiceInsertedData;

      reply.code(200).send({
        username: username,
        email: email,
        phone: phone,
        biography: biography,
        signInMethod: signInMethod,
      });
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async updateUserDetails(
    request: FastifyRequest<{ Body: editUserDetailsBody }>,
    reply: FastifyReply
  ) {
    try {
      const { username, biography, phone, currentPassword, newPassword } =
        request.body;

      const isChangingPassword: boolean = newPassword.trim() !== "";

      const signInMethod = request.signInMethod;
      const canChangePassword: boolean = signInMethod === "credentials";

      if (isChangingPassword === true && canChangePassword === false) {
        return UserController.handleError(
          reply,
          400,
          Errors.SignInMethodUpdatePassword
        );
      }

      if (isChangingPassword === true) {
        const verifyUserPassword =
          await UserController.userService.ValidateUserPassword(
            request.userId,
            currentPassword
          );

        if (verifyUserPassword.success === false) {
          return UserController.handleError(
            reply,
            400,
            Errors.IncorrectPassword
          );
        }
      }

      const updatedUserDetails =
        await UserController.userService.UpdateUserDetails(
          request.userId,
          username.trim(),
          phone.trim(),
          biography.trim(),
          newPassword.trim()
        );

      if (updatedUserDetails.success === false) {
        return UserController.handleError(
          reply,
          400,
          updatedUserDetails?.customError
        );
      }

      reply.code(200);
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async logout(_: FastifyRequest, reply: FastifyReply) {
    reply.code(200).clearCookie(EnvironmentVariables.Cookie_Name, {
      path: "/",
    });
  }

  async checkIfUserIsAuthenticated(_: FastifyRequest, reply: FastifyReply) {
    reply.code(403);
  }
}

export default UserController;
