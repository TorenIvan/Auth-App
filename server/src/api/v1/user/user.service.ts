import { Collection, ObjectId } from "mongodb";
import { Errors } from "../../../config/utils/constants/Errors";
import { objectAttributeExistsAndHasValue } from "../../../config/utils/helpers";
import User from "./user.model";
import * as bcrypt from "bcryptjs";
import { EnvironmentVariables } from "../../../config/utils/constants/EnvironmentVariables";

/**
 * Keeps all the "database" logic of User Collection; including transactions if needed
 */
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
      const userExists: boolean = !!(await UserService.users.findOne({
        email: email,
      }));
      if (userExists === true) {
        throw {
          customError: Errors.UserAlreadyExists,
        };
      }
      const salt = await bcrypt.genSalt(Number(EnvironmentVariables.Salt_Size));
      const hash = await bcrypt.hash(password, salt);

      const result = await UserService.users.insertOne({
        username: username,
        email: email,
        biography: "",
        phone: "",
        password: hash,
        signInMethod: "credentials",
        isVerified: false,
      });
      const data: ServiceInsertedData = {
        userId: result.insertedId,
        username: username,
        email: email,
        biography: "",
        phone: "",
      };
      return { success: true, data: data };
    } catch (error) {
      return UserService.handleError(error);
    }
  }

  async ValidateUserWithCredentials(
    email: string,
    password: string
  ): Promise<ServiceResponse> {
    try {
      const result = await UserService.users.findOne(
        {
          email: email,
          isVerified: true,
        },
        {
          projection: {
            username: 1,
            email: 1,
            password: 1,
            _id: 1,
          },
        }
      );
      if (!!result === false) {
        throw {
          customError: Errors.UserNotFoundWithTheseCreds,
        };
      }
      const isCorrectPassword: boolean = await bcrypt.compare(
        password,
        result?.password || ""
      );
      if (isCorrectPassword === false) {
        throw {
          customError: Errors.UserNotFoundWithTheseCreds,
        };
      }

      const data: ServiceInsertedData = {
        userId: result!._id,
        username: result!.username,
        email: email,
        biography: result!.biography,
        phone: result!.phone,
      };
      return { success: true, data: data };
    } catch (error) {
      return UserService.handleError(error);
    }
  }

  async CheckUserEmailConfirmation(email: string) {
    try {
      const isVerified: boolean = !!(await UserService.users.findOne({
        email: email,
        isVerified: true,
      }));
      return { success: isVerified };
    } catch (error) {
      return UserService.handleError(error);
    }
  }

  async UpdateIsVerifiedWhenUserExists(userId: string) {
    try {
      const userFound = !!(await UserService.users.findOne({
        _id: new ObjectId(userId),
      }));
      if (userFound === false) {
        throw {
          customError: Errors.UserNotFoundWithTheseCreds,
        };
      }
      await UserService.users.updateOne(
        {
          _id: new ObjectId(userId),
        },
        {
          $set: {
            isVerified: true,
          },
        }
      );
      return { success: true };
    } catch (error) {
      return UserService.handleError(error);
    }
  }

  async CheckEmailExistence(email: string) {
    try {
      const itExists = await UserService.users.findOne(
        {
          email: email,
        },
        {
          projection: {
            _id: 1,
          },
        }
      );
      if (!!itExists === false) {
        throw "User not found with this email";
      }
      const data: ServiceFoundData = {
        userId: itExists!._id,
      };
      return { success: true, data: data };
    } catch (error) {
      return UserService.handleError(error);
    }
  }
}

export default UserService;
