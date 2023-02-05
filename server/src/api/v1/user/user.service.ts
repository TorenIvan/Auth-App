import { Collection } from "mongodb";
import { Errors } from "../../../config/utils/constants/Errors";
import { objectAttributeExistsAndHasValue } from "../../../config/utils/helpers";
import User from "./user.model";

/**
 * Keeps all the "database" logic of User Collection; including transactions if needed
 */
class UserService {
  private static instance: InstanceType<typeof UserService>;
  private users!: Collection<User>;

  constructor(UserCollection: Collection<User>) {
    if (UserService.instance === undefined) {
      UserService.instance = this;
      this.users = UserCollection;
    }
    return UserService.instance;
  }

  static handleError(error: any): ServiceResponse {
    console.error(error);
    if (objectAttributeExistsAndHasValue(error, "customError") === true) {
      return { success: false, customError: error.customError };
    }
    return { success: false };
  }

  async InsertUserWithCredentials(
    email: string,
    password: string
  ): Promise<ServiceResponse> {
    const username: string = email.split("@")[0];
    try {
      const userExists: boolean = !!(await this.users.findOne({
        email: email,
      }));
      if (userExists === true) {
        throw {
          customError: Errors.UserAlreadyExists,
        };
      }
      const result = await this.users.insertOne({
        username: username,
        email: email,
        password: password,
        signInMethod: "credentials",
      });
      const data: ServiceInsertedData = {
        userId: result.insertedId,
      };
      return { success: true, data: data };
    } catch (error) {
      return UserService.handleError(error);
    }
  }
}

export default UserService;
