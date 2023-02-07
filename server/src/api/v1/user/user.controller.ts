import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { EnvironmentVariables } from "../../../config/utils/constants/EnvironmentVariables";
import { generateCookieOptions } from "../../../config/utils/helpers/auth/generateCookieOptions";
import {
  generateAuthJWTs,
  generateJWT,
} from "../../../config/utils/helpers/auth/generateJWTs";
import { sendEmail } from "../../../config/utils/helpers/general/sendEmail";
import { credsUserInput } from "./user.schema";
import UserService from "./user.service";

/**
 * Keeps all the "bussiness" logic of User Collection
 * ToDos:
 * 1) MJML send email on register
 * 2) Add isVerified and verification token flag
 * 3) Do not let the user who is not verified enter the site
 * 4) Add a way  to check access and refresh tokens
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
      },
      EnvironmentVariables.Email_Secret,
      EnvironmentVariables.Email_Token_Expiration_Time
    );

    sendEmail(email, email_token);

    reply.code(201);
  }

  async loginCredentialsHandler(
    request: FastifyRequest<{ Body: credsUserInput }>,
    reply: FastifyReply
  ) {
    const { email, password } = request.body;

    const serviceResponse: ServiceResponse =
      await UserController.userService.ValidateUserWithCredentials(
        email,
        password
      );

    const credentialsAuthenticated: boolean = serviceResponse.success;
    if (credentialsAuthenticated === false) {
      return UserController.handleError(
        reply,
        400,
        serviceResponse?.customError
      );
    }

    const { access_token, refresh_token } = generateAuthJWTs(
      serviceResponse.data!.userId.toString()
    );
    const cookieOptions = generateCookieOptions();

    reply
      .code(200)
      .setCookie(EnvironmentVariables.Cookie_Name, refresh_token, cookieOptions)
      .send({ access_token: access_token });
  }
}

export default UserController;
