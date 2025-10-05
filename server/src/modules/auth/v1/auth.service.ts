import { Collection, Db, ObjectId } from 'mongodb';
import * as bcrypt from 'bcryptjs';
import { Errors } from '../../../config/utils/constants/Errors';
import { objectAttributeExistsAndHasValue } from '../../../config/utils/helpers';
import { EnvironmentVariables } from '../../../config/utils/constants/EnvironmentVariables';
import User from '../../user/v1/user.model';
import RefreshToken from './auth.model';

class AuthService {
  private users: Collection<User>;
  private refreshTokens: Collection<RefreshToken>;

  constructor(private db: Db) {
    this.users = this.db.collection<User>('users');
    this.refreshTokens = this.db.collection<RefreshToken>('refresh_tokens');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static handleError(error: any): ServiceResponse {
    console.error(error);
    if (objectAttributeExistsAndHasValue(error, 'customError') === true) {
      return { success: false, customError: error.customError };
    }
    return { success: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static handleTokenError(error: any): ServiceResponseToken {
    console.error(error);
    if (objectAttributeExistsAndHasValue(error, 'customError') === true) {
      return { success: false, customError: error.customError };
    }
    return { success: false };
  }

  async CreateRefreshToken(
    userId: string,
    token: string,
    ip?: string,
    userAgent?: string
  ): Promise<ServiceResponseToken> {
    try {
      const userObjectId = new ObjectId(userId);
      const expiresAt = new Date();
      expiresAt.setDate(
        expiresAt.getDate() +
          parseInt(EnvironmentVariables.Refresh_Token_Expiration_Time.replace(/\D/g, ''), 10)
      );

      const tokenId = new ObjectId();
      await this.refreshTokens.insertOne({
        _id: tokenId,
        userId: userObjectId,
        token,
        createdAt: new Date(),
        expiresAt,
        revoked: false,
        ip,
        userAgent,
      });

      return { success: true, data: { tokenId } };
    } catch (error) {
      return AuthService.handleTokenError(error);
    }
  }

  async InsertUserWithCredentials(email: string, password: string): Promise<ServiceResponse> {
    const username: string = email.split('@')[0];

    try {
      // Pre-generate salt and hash in parallel with user existence check
      const [userExists, salt] = await Promise.all([
        this.users.findOne({ email: email }, { projection: { _id: 1 } }),
        bcrypt.genSalt(Number(EnvironmentVariables.Salt_Size)),
      ]);

      if (userExists) {
        throw {
          customError: Errors.UserAlreadyExists,
        };
      }

      const hash = await bcrypt.hash(password, salt);

      const userId = new ObjectId();
      await this.users.insertOne({
        _id: userId,
        username: username,
        email: email,
        biography: '',
        phone: '',
        password: hash,
        signInMethod: 'credentials',
        isVerified: false,
        schemaVersion: 0,
        isActive: true,
      });

      const data: ServiceInsertedData = {
        userId: userId,
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

  async UpdateRefreshToken(
    tokenId: string,
    newToken: string,
    ip?: string,
    userAgent?: string
  ): Promise<ServiceResponse> {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(
        expiresAt.getDate() +
          parseInt(EnvironmentVariables.Refresh_Token_Expiration_Time.replace(/\D/g, ''), 10)
      );

      await this.refreshTokens.updateOne(
        { _id: new ObjectId(tokenId) },
        {
          $set: {
            token: newToken,
            createdAt: new Date(),
            expiresAt,
            ip,
            userAgent,
          },
        }
      );

      return { success: true };
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
      const userExists = await this.users.findOne({
        email: email,
      });
      if (userExists) {
        throw {
          customError: Errors.UserAlreadyExists,
        };
      }
      const userId = new ObjectId();
      await this.users.insertOne({
        _id: userId,
        username: username,
        email: email,
        biography: biography,
        phone: '',
        password: '',
        signInMethod: signInMethod,
        isVerified: true,
        schemaVersion: 0,
        isActive: true,
      });
      const data: ServiceInsertedData = {
        userId: userId,
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

  async RevokeRefreshToken(tokenId: string): Promise<ServiceResponse> {
    try {
      const now = new Date();
      const deleteAfter = new Date();
      deleteAfter.setDate(deleteAfter.getDate() + Number(EnvironmentVariables.Token_Deletion_Time));

      await this.refreshTokens.updateOne(
        { _id: new ObjectId(tokenId) },
        {
          $set: {
            revoked: true,
            revokedAt: now,
            deleteAt: deleteAfter, // When to auto-delete (x days after revoked)
          },
        }
      );
      return { success: true };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async RevokeRefreshTokenByToken(token: string): Promise<ServiceResponse> {
    try {
      const now = new Date();
      const deleteAfter = new Date();
      deleteAfter.setDate(deleteAfter.getDate() + Number(EnvironmentVariables.Token_Deletion_Time));

      await this.refreshTokens.updateOne(
        { token: token, revoked: false },
        {
          $set: {
            revoked: true,
            revokedAt: now,
            deleteAt: deleteAfter, // When to auto-delete (x days after revoked)
          },
        }
      );
      return { success: true };
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
            isActive: 1,
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
      const data: ServiceInsertedData = {
        userId: result._id,
        username: result.username,
        email: email,
        biography: result.biography,
        phone: result.phone,
        image: result.image,
        isVerified: result.isVerified,
        isActive: result.isActive,
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
          isActive: true,
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
