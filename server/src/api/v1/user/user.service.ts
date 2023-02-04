import { Collection } from "mongodb";
import { Errors } from "../../../config/utils/constants/Errors";
import { objectAttributeExistsAndHasValue } from "../../../config/utils/helpers";
import User from "./user.model";

class UserService {
  private static instance: InstanceType<typeof UserService>;
  private static users: Collection<User>;

  constructor(UserCollection: Collection<User>) {
    if (UserService.instance === undefined) {
      UserService.instance = this;
      UserService.users = UserCollection;
    }
    return UserService.instance;
  }

  static handleError(error: any): ServiceResponse {
    console.error(error);
    console.log("Mpika error: ", error);

    if (objectAttributeExistsAndHasValue(error, "customError") === true) {
      console.log("Aera mpika");
      return { success: false, customError: error.customError };
    }
    console.log("Aera den mpika");
    return { success: false };
  }

  async InsertUserWithCredentials(
    email: string,
    password: string
  ): Promise<ServiceResponse> {
    const username: string = email.split("@")[0];
    try {
      const userExists: boolean = !!(await UserService.users.findOne({
        email: email,
      }));
      if (userExists === true) {
        throw {
          customError: Errors.UserAlreadyExists,
        };
      }
      await UserService.users.insertOne({
        username: username,
        email: email,
        password: password,
        signInMethod: "credentials",
      });
      return { success: true };
    } catch (error) {
      return UserService.handleError(error);
    }
  }
}

export default UserService;
