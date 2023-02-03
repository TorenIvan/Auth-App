import { Collection } from "mongodb";
import User from "../models/User";

class UserService {
  private static instance: InstanceType<typeof UserService>;
  private static users: Collection<User>;

  constructor(UserCollection: Collection<User>) {
    if (UserService.instance == null) {
      UserService.instance = this;
      UserService.users = UserCollection;
    }
    return UserService.instance;
  }

  async InsertUserWithCredentials(
    email: string,
    password: string
  ): Promise<boolean> {
    const username: string = email.split("@")[0];
    try {
      const userExists: boolean = !!(await UserService.users.findOne({
        email: email,
      }));
      if (userExists === true) throw "User already exists";
      await UserService.users.insertOne({
        username: username,
        email: email,
        password: password,
        signInMethod: "credentials",
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default UserService;
