import { Collection, Db, ObjectId } from 'mongodb';
import * as bcrypt from 'bcryptjs';
import { Errors } from '../../../config/utils/constants/Errors';
import { objectAttributeExistsAndHasValue } from '../../../config/utils/helpers';
import { EnvironmentVariables } from '../../../config/utils/constants/EnvironmentVariables';
import { Strings } from '../../../config/utils/constants/Strings';
import { logger } from '../../../config/utils/helpers';
import User from '../../user/v1/user.model';
import RefreshToken from './auth.model';

/**
 * Compared against when the user does not exist, so login takes the same time either way (no user enumeration).
 */
const DUMMY_PASSWORD_HASH: string = bcrypt.hashSync(
  'dummy-password',
  Number(EnvironmentVariables.Salt_Size)
);

class AuthService {
  private users: Collection<User>;
  private refreshTokens: Collection<RefreshToken>;

  constructor(private db: Db) {
    this.users = this.db.collection<User>('users');
    this.refreshTokens = this.db.collection<RefreshToken>('refresh_tokens');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static handleError(error: any): ServiceResponse {
    logger.error(error);
    if (objectAttributeExistsAndHasValue(error, 'customError') === true) {
      return { success: false, customError: error.customError };
    }
    return { success: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static handleTokenError(error: any): ServiceResponseToken {
    logger.error(error);
    if (objectAttributeExistsAndHasValue(error, 'customError') === true) {
      return { success: false, customError: error.customError };
    }
    return { success: false };
  }

  /**
   * @description Creates the session (token family) document. Its _id is the `sid` claim of the tokens.
   */
  async CreateRefreshToken(
    sessionId: ObjectId,
    userId: string,
    tokenHash: string,
    expiresAt: Date,
    ip?: string,
    userAgent?: string
  ): Promise<ServiceResponseToken> {
    try {
      await this.refreshTokens.insertOne({
        _id: sessionId,
        userId: new ObjectId(userId),
        token: tokenHash,
        createdAt: new Date(),
        expiresAt,
        revoked: false,
        ip,
        userAgent,
      });

      return { success: true, data: { tokenId: sessionId } };
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

  /**
   * @description Atomic refresh token rotation with reuse detection.
   * 1. The presented token is the current one: rotate it and remember it as previousToken.
   * 2. It is the previous one, rotated less than the grace window ago (aborted response, e.g. reload):
   *    issue a new token, previousToken stays the same.
   * 3. Anything else is a reuse of an old token of this family: the caller revokes the session.
   * Two plain updateOne calls (no aggregation pipeline), so values such as the user agent can never be
   * interpreted as field paths.
   */
  async RotateRefreshToken(
    sessionId: string,
    userId: string,
    presentedTokenHash: string,
    newTokenHash: string,
    expiresAt: Date,
    ip?: string,
    userAgent?: string
  ): Promise<ServiceResponse> {
    try {
      const now = new Date();
      const sessionFilter = {
        _id: new ObjectId(sessionId),
        userId: new ObjectId(userId),
        revoked: false,
        expiresAt: { $gt: now },
      };

      const rotated = await this.refreshTokens.updateOne(
        { ...sessionFilter, token: presentedTokenHash },
        {
          $set: {
            previousToken: presentedTokenHash,
            token: newTokenHash,
            rotatedAt: now,
            expiresAt,
            ip,
            userAgent,
          },
        }
      );
      if (rotated.modifiedCount === 1) {
        return { success: true };
      }

      const rotatedWithinGrace = await this.refreshTokens.updateOne(
        {
          ...sessionFilter,
          previousToken: presentedTokenHash,
          rotatedAt: { $gt: new Date(now.getTime() - Strings.RefreshTokenReuseGraceMs) },
        },
        { $set: { token: newTokenHash, expiresAt, ip, userAgent } }
      );
      if (rotatedWithinGrace.modifiedCount === 1) {
        return { success: true };
      }

      throw {
        customError: Errors.RefreshTokenReused,
      };
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

  async RevokeRefreshToken(sessionId: string, userId: string): Promise<ServiceResponse> {
    try {
      const now = new Date();
      const deleteAfter = new Date();
      deleteAfter.setDate(deleteAfter.getDate() + Number(EnvironmentVariables.Token_Deletion_Time));

      await this.refreshTokens.updateOne(
        { _id: new ObjectId(sessionId), userId: new ObjectId(userId), revoked: false },
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

  /**
   * @description Revokes every session of the user (password reset/change, logout from all devices).
   * Succeeds even when there is nothing left to revoke.
   */
  async RevokeAllUserSessions(userId: string, exceptSessionId?: string): Promise<ServiceResponse> {
    try {
      const now = new Date();
      const deleteAfter = new Date();
      deleteAfter.setDate(deleteAfter.getDate() + Number(EnvironmentVariables.Token_Deletion_Time));

      await this.refreshTokens.updateMany(
        {
          userId: new ObjectId(userId),
          revoked: false,
          ...(exceptSessionId !== undefined && { _id: { $ne: new ObjectId(exceptSessionId) } }),
        },
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

  /**
   * @description A social provider has just proven ownership of the email: an unverified credentials
   * account with that email (possibly pre-registered by someone else) becomes verified and loses its password.
   */
  async ClaimUnverifiedAccount(userId: string): Promise<ServiceResponse> {
    try {
      await this.users.updateOne(
        { _id: new ObjectId(userId), isVerified: false },
        { $set: { isVerified: true, password: '' } }
      );
      return { success: true };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  async FindUserByEmail(email: string): Promise<ServiceResponse> {
    try {
      const result = await this.users.findOne(
        { email: email },
        {
          projection: {
            _id: 1,
            username: 1,
            email: 1,
            signInMethod: 1,
            isVerified: 1,
            isActive: 1,
          },
        }
      );
      if (result === null) {
        throw 'User not found with this email';
      }
      const data: ServiceInsertedData = {
        userId: result._id,
        username: result.username,
        email: result.email,
        biography: '',
        phone: '',
        signInMethod: result.signInMethod as SignInMethod,
        isVerified: result.isVerified,
        isActive: result.isActive,
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
            isActive: 1,
            _id: 1,
          },
        }
      );

      if (result === null) {
        await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
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
            passwordChangedAt: 1,
          },
        }
      );
      if (!!itExists === false) {
        throw 'User not found with this identifier';
      }
      const data: ServiceFoundData = {
        userId: itExists!._id,
        passwordChangedAt: itExists!.passwordChangedAt,
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
            passwordChangedAt: new Date(),
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
