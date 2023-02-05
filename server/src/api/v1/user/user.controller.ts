import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { EnvironmentVariables } from "../../../config/utils/constants/EnvironmentVariables";
import { generateJWT } from "../../../config/utils/helpers";
import { generateCookieOptions } from "../../../config/utils/helpers/auth/generateCookieOptions";
import { credsUserInput } from "./user.schema";
import UserService from "./user.service";

/**
 * Keeps all the "bussiness" logic of User Collection
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
      let error;
      if (serviceResponse.customError !== undefined) {
        error = UserController.fastifyInstance.httpErrors.badRequest(
          serviceResponse.customError
        );
      } else {
        error = UserController.fastifyInstance.httpErrors.badRequest();
      }
      reply.code(400).send(error);
      return;
    }

    const tokenPayload = {
      userId: serviceResponse.data!.userId.toString(),
      signInWithCredentials: true,
    };

    const access_token = generateJWT(
      tokenPayload,
      EnvironmentVariables.Access_Token_Secret,
      EnvironmentVariables.Access_Token_Expiration_Time
    );

    const refresh_token = generateJWT(
      tokenPayload,
      EnvironmentVariables.Refresh_Token_Secret,
      EnvironmentVariables.Refresh_Token_Expiration_Time
    );

    const cookieOptions = generateCookieOptions();
    reply
      .code(201)
      .setCookie(EnvironmentVariables.Cookie_Name, refresh_token, cookieOptions)
      .send({ access_token: access_token });
  }
}

export default UserController;
