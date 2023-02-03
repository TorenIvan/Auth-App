import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { credsUserInput } from "./user.schema";
import UserService from "./user.service";

/**
 * User Controller keeps all the "bussiness" logic User
 * Using Singleton Design Pattern to initiate a UserController instance only once
 */
class UserController {
  private static instance: InstanceType<typeof UserController>;
  private static userService: InstanceType<typeof UserService>;
  private static fastifyInstance: FastifyInstance;

  constructor(fastifyInstance: FastifyInstance) {
    if (UserController.instance == null) {
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

    const insertedCorrectly: boolean =
      await UserController.userService.InsertUserWithCredentials(
        email,
        password
      );

    console.log("this is: ", UserController.fastifyInstance.User);

    const statusCode: number = insertedCorrectly === true ? 201 : 400;
    reply.code(statusCode);
  }
}

export default UserController;
