import { Collection, Db, ObjectId } from 'mongodb';
import { Errors } from '../../../config/utils/constants/Errors';
import { objectAttributeExistsAndHasValue } from '../../../config/utils/helpers';
import * as bcrypt from 'bcryptjs';
import { EnvironmentVariables } from '../../../config/utils/constants/EnvironmentVariables';
import User from '../../user/v1/user.model';

class AuthService {
  private users: Collection<User>;

  constructor(private db: Db) {
    this.users = this.db.collection<User>('users');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static handleError(error: any): ServiceResponse {
    console.error(error);
    if (objectAttributeExistsAndHasValue(error, 'customError') === true) {
      return { success: false, customError: error.customError };
    }
    return { success: false };
  }

  async InsertUserWithCredentials(email: string, password: string): Promise<ServiceResponse> {
    const username: string = email.split('@')[0];
    try {
      const userExists: boolean = !!(await this.users.findOne({
        email: email,
      }));
      if (userExists === true) {
        throw {
          customError: Errors.UserAlreadyExists,
        };
      }
      const salt = await bcrypt.genSalt(Number(EnvironmentVariables.Salt_Size));
      const hash = await bcrypt.hash(password, salt);

      const result = await this.users.insertOne({
        _id: new ObjectId(),
        username: username,
        email: email,
        biography: '',
        phone: '',
        password: hash,
        signInMethod: 'credentials',
        isVerified: false,
        schemaVersion: 0,
        refreshToken: '',
        isActive: true,
      });
      const data: ServiceInsertedData = {
        userId: result.insertedId,
        username: username,
        email: email,
        biography: '',
        phone: '',
        signInMethod: 'credentials',
      };
      return { success: true, data: data };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async InsertUserWithSocialAccount(
    username: string,
    email: string,
    biography: string,
    signInMethod: SignInMethod
  ) {
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
        _id: new ObjectId(),
        username: username,
        email: email,
        biography: biography,
        phone: '',
        password: '',
        refreshToken: '',
        signInMethod: signInMethod,
        isVerified: true,
        schemaVersion: 0,
        isActive: true,
      });
      const data: ServiceInsertedData = {
        userId: result.insertedId,
        username: username,
        email: email,
        biography: biography,
        phone: '',
        signInMethod: signInMethod,
      };
      return { success: true, data: data };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async updateUserRefreshToken(email: string, token: string) {
    try {
      await this.users.updateOne(
        {
          email,
        },
        {
          $set: {
            refreshToken: token,
          },
        }
      );
      return { success: true };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async updateUserRefreshTokenById(userId: string, token: string) {
    try {
      await this.users.updateOne(
        {
          _id: new ObjectId(userId),
        },
        {
          $set: {
            refreshToken: token,
          },
        }
      );
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async CheckGivenSocialPlatformEmailExistence(
    email: string,
    signInMethod: SignInMethod
  ): Promise<ServiceResponse> {
    try {
      const result = await this.users.findOne(
        {
          email: email,
          signInMethod: signInMethod,
        },
        {
          projection: {
            _id: 1,
          },
        }
      );
      if (result === null) {
        //User not found
        throw '';
      }
      const data: ServiceFoundData = {
        userId: result._id,
      };
      return { success: true, data: data };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async ValidateUserWithCredentials(email: string, password: string): Promise<ServiceResponse> {
    try {
      const result = await this.users.findOne(
        {
          email: email,
        },
        {
          projection: {
            username: 1,
            email: 1,
            password: 1,
            isVerified: 1,
            _id: 1,
          },
        }
      );

      if (result === null) {
        throw {
          customError: Errors.UserNotFoundWithTheseCreds,
        };
      }
      const isCorrectPassword: boolean = await bcrypt.compare(password, result?.password || '');
      if (isCorrectPassword === false) {
        throw {
          customError: Errors.UserNotFoundWithTheseCreds,
        };
      }

      //   if (result.image) {
      //     result.image.data = result.image.data;
      //   }

      const data: ServiceInsertedData = {
        userId: result._id,
        username: result.username,
        email: email,
        biography: result.biography,
        phone: result.phone,
        image: result.image,
        isVerified: result.isVerified,
        signInMethod: result.signInMethod as SignInMethod,
      };
      return { success: true, data: data };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async ValidateUserPassword(userId: string, password: string): Promise<ServiceResponse> {
    try {
      const result = await this.users.findOne(
        {
          _id: new ObjectId(userId),
        },
        {
          projection: {
            password: 1,
          },
        }
      );
      if (result === null) {
        throw {
          customError: Errors.UserNotFoundWithTheseCreds,
        };
      }
      const isCorrectPassword: boolean = await bcrypt.compare(password, result?.password || '');
      if (isCorrectPassword === false) {
        throw {
          customError: Errors.UserNotFoundWithTheseCreds,
        };
      }

      return { success: true };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async CheckUserEmailConfirmation(email: string) {
    try {
      const isVerified: boolean = !!(await this.users.findOne({
        email: email,
        isVerified: true,
      }));
      return { success: isVerified };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async UpdateIsVerifiedWhenUserExists(userId: string) {
    try {
      const userFound = !!(await this.users.findOne({
        _id: new ObjectId(userId),
      }));
      if (userFound === false) {
        throw {
          customError: Errors.UserNotFoundWithTheseCreds,
        };
      }
      await this.users.updateOne(
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
      return AuthService.handleError(error);
    }
  }

  async CheckEmailExistence(email: string) {
    try {
      const itExists = await this.users.findOne(
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
        throw 'User not found with this email';
      }
      const data: ServiceFoundData = {
        userId: itExists!._id,
      };
      return { success: true, data: data };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async CheckUserIdExistence(id: string) {
    try {
      const itExists = await this.users.findOne(
        {
          _id: new ObjectId(id),
        },
        {
          projection: {
            _id: 1,
          },
        }
      );
      if (!!itExists === false) {
        throw 'User not found with this identifier';
      }
      const data: ServiceFoundData = {
        userId: itExists!._id,
      };
      return { success: true, data: data };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async ResetPassword(userId: string, newPassword: string) {
    try {
      const salt = await bcrypt.genSalt(Number(EnvironmentVariables.Salt_Size));
      const hash = await bcrypt.hash(newPassword, salt);
      await this.users.updateOne(
        {
          _id: new ObjectId(userId),
        },
        {
          $set: {
            password: hash,
          },
        }
      );
      return { success: true };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }
}

export default AuthService;
