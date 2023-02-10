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
      error = UserController.fastifyInstance.httpErrors.badRequest(customError);
    } else {
      error = UserController.fastifyInstance.httpErrors.badRequest();
    }
    reply.code(errorCode).send(error);
    return;
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

  async confirmEmailHandler(
    request: FastifyRequest<{ Querystring: queryConfirmEmail }>,
    reply: FastifyReply
  ) {
    let token;
    let data;

    try {
      token = request.query?.token;
      if (!!token === false) throw "error";
      data = verifyJWT(
        token,
        EnvironmentVariables.Email_Secret
      ) as TokenInterface;
      if (!!data?.userId === false || !!data?.type === false) {
        throw "error";
      }
    } catch (error) {
      return UserController.handleError(reply, 400, Errors.TokenExpired);
    }

    const { userId, type } = data;
    if (type !== Strings.ConfirmEmailType) {
      return UserController.handleError(reply, 400, Errors.IncorrectToken);
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
    reply.code(200).setCookie;
  }

  async forgotPasswordHandler(
    request: FastifyRequest<{ Body: forgotPasswordInput }>,
    reply: FastifyReply
  ) {
    const { email } = request.body;
    const serviceResponse: ServiceResponse =
      await UserController.userService.CheckEmailExistence(email);

    const emailExists = serviceResponse.success;

    /**
     * Do not let the FrontEnd know if the email is actually valid
     */
    if (emailExists === true) {
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

      return reply
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
    request: FastifyRequest<{ Body: resetPasswordUserInput }>,
    reply: FastifyReply
  ) {
    const { newPassword, confirmNewPassword } = request.body;

    if (newPassword !== confirmNewPassword) {
      return UserController.handleError(reply, 400, Errors.PasswordsNotSame);
    }
  }
}

export default UserController;
