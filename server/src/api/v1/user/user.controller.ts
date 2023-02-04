import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { credsUserInput } from "./user.schema";
import UserService from "./user.service";

/**
 * User Controller keeps all the "bussiness" logic User Collection
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

    console.log("this is: ", UserController.fastifyInstance.User);

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
    }
    reply.code(201);
  }
}

export default UserController;
