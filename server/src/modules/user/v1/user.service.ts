import { Collection, Db, ObjectId, UpdateResult } from "mongodb";
import { Errors } from "../../../config/utils/constants/Errors";
import { objectAttributeExistsAndHasValue } from "../../../config/utils/helpers";
import User from "./user.model";
import * as bcrypt from "bcryptjs";
import { EnvironmentVariables } from "../../../config/utils/constants/EnvironmentVariables";

class UserService {
  private users: Collection<User>;

  constructor(private db: Db) {
    this.users = this.db.collection<User>("users");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static handleError(error: any): ServiceResponse {
    console.error(error);
    if (objectAttributeExistsAndHasValue(error, "customError") === true) {
      return { success: false, customError: error.customError };
    }
    return { success: false };
  }

  async RetrieveUserDetails(userId: string): Promise<ServiceResponse> {
    try {
      const result = await this.users.findOne(
        {
          _id: new ObjectId(userId),
        },
        {
          projection: {
            username: 1,
            email: 1,
            signInMethod: 1,
            biography: 1,
            image: 1,
            phone: 1,
            _id: 1,
          },
        }
      );
      if (result === null) {
        throw {
          customError: Errors.UserNotFoundWithTheseCreds,
        };
      }

      const data: ServiceInsertedData = {
        userId: result._id,
        username: result.username,
        email: result.email,
        biography: result.biography,
        phone: result.phone,
        image: result.image,
        signInMethod: result.signInMethod as SignInMethod,
      };
      return { success: true, data: data };
    } catch (error) {
      return UserService.handleError(error);
    }
  }

  async UpdateUserDetails(
    userId: string,
    username: string,
    phone: string,
    biography: string,
    newPassword: string,
    image: UploadedFile | null
  ): Promise<ServiceResponse> {
    try {
      const updateFields = {
        username,
        phone,
        biography,
      };

      if (newPassword !== "") {
        const salt = await bcrypt.genSalt(
          Number(EnvironmentVariables.Salt_Size)
        );
        const hash = await bcrypt.hash(newPassword.trim(), salt);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        updateFields.password = hash;
      }

      if (image !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { limit, ...restImageProperties } = image;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        updateFields.image = restImageProperties;
      }

      const result: UpdateResult = await this.users.updateOne(
        {
          _id: new ObjectId(userId),
        },
        {
          $set: updateFields,
        }
      );

      if (result.acknowledged === false) {
        throw {
          customError: Errors.GenericError,
        };
      }

      return { success: true };
    } catch (error) {
      return UserService.handleError(error);
    }
  }
}

export default UserService;
