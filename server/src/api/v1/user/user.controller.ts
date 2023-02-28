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
        default:
          error =
            UserController.fastifyInstance.httpErrors.badRequest(customError);
      }
    } else {
      switch (errorCode) {
        case 403:
          error = UserController.fastifyInstance.httpErrors.forbidden();
          break;
        case 401:
          error = UserController.fastifyInstance.httpErrors.unauthorized();
          break;
        default:
          error = UserController.fastifyInstance.httpErrors.badRequest();
      }
    }
    reply.code(errorCode).send(error);
    return;
  }

  static verifyQueryToken(query: { token?: string }): TokenInterface | null {
    let data: TokenInterface | null = null;
    try {
      let token = query.token;
      if (!!token === false) throw "error";

      data = verifyJWT(token!, EnvironmentVariables.Email_Secret);
      if (!!data?.userId === false) throw "error";
      if (!!data?.type === false) throw "error";

      return data;
    } catch (error) {
      return null;
    }
  }

  async registerCredentialsHandler(
    request: FastifyRequest<{ Body: credsUserInput }>,
    reply: FastifyReply
  ) {
    const { email, password } = request.body;

    const serviceResponse: ServiceResponse =
      await UserController.userService.InsertUserWithCredentials(
        email,
        password
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
  }

  async confirmEmailHandler(
    request: FastifyRequest<{ Querystring: queryConfirmEmail }>,
    reply: FastifyReply
  ) {
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
  }

  async loginCredentialsHandler(
    request: FastifyRequest<{ Body: credsUserInput }>,
    reply: FastifyReply
  ) {
    const { email, password } = request.body;

    const userCredsResponse: ServiceResponse =
      await UserController.userService.ValidateUserWithCredentials(
        email,
        password
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
      .setCookie(EnvironmentVariables.Cookie_Name, refresh_token, cookieOptions)
      .send({ access_token: access_token });
  }

  async forgotPasswordHandler(
    request: FastifyRequest<{ Body: forgotPasswordInput }>,
    reply: FastifyReply
  ) {
    const { email } = request.body;

    const serviceResponse: ServiceResponse =
      await UserController.userService.CheckEmailExistence(email);

    const emailExists = serviceResponse.success;

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
  }

  async resetPasswordHandler(
    request: FastifyRequest<{
      Querystring: queryConfirmEmail;
      Body: resetPasswordUserInput;
    }>,
    reply: FastifyReply
  ) {
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
  }
}

export default UserController;
