import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { EnvironmentVariables } from "../../../config/utils/constants/EnvironmentVariables";
import { generateJWT } from "../../../config/utils/helpers";
import { credsUserInput } from "./user.schema";
import UserService from "./user.service";

/**
 * Keeps all the "bussiness" logic of User Collection
 */
class UserController {
  private static instance: InstanceType<typeof UserController>;
  private userService!: InstanceType<typeof UserService>;
  private fastifyInstance!: FastifyInstance;

  constructor(fastifyInstance: FastifyInstance) {
    if (UserController.instance === undefined) {
      UserController.instance = this;
      this.fastifyInstance = fastifyInstance;
      this.userService = new UserService(fastifyInstance.User);
    }
    return UserController.instance;
  }

  async registerCredentialsHandler(
    request: FastifyRequest<{ Body: credsUserInput }>,
    reply: FastifyReply
  ) {
    const { email, password } = request.body;
    const serviceResponse: ServiceResponse =
      await this.userService.InsertUserWithCredentials(email, password);

    const insertedCorrectly: boolean = serviceResponse.success;
    if (insertedCorrectly === false) {
      let error;
      if (serviceResponse.customError !== undefined) {
        error = this.fastifyInstance.httpErrors.badRequest(
          serviceResponse.customError
        );
      } else {
        error = this.fastifyInstance.httpErrors.badRequest();
      }
      reply.code(400).send(error);
    }

    const access_token = generateJWT(
      { id: serviceResponse.data!.userId },
      EnvironmentVariables.Access_Token_Secret,
      EnvironmentVariables.Access_Token_Expiration_Time
    );
    reply.code(201).send({ access_token: access_token });
  }
}

export default UserController;
