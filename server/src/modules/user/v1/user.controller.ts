import { MongoClient, TransactionOptions } from "mongodb";
import { FastifyReply, FastifyRequest } from "fastify";
import createError from "@fastify/error";
import { EnvironmentVariables } from "../../../config/utils/constants/EnvironmentVariables";
import { Errors } from "../../../config/utils/constants/Errors";
import { Strings } from "../../../config/utils/constants/Strings";
import {
  generateCookieOptions,
  generateCookieOptionsToClear,
  generateResetCookieOptions,
  generateSocialCookieOptions,
} from "../../../config/utils/helpers/auth/generateCookieOptions";
import {
  generateAuthJWTs,
  generateJWT,
  verifyJWT,
} from "../../../config/utils/helpers/auth/generateJWTs";
import { sendEmail } from "../../../config/utils/helpers/general/sendEmail";
import {
  credentialsUserInput,
  editUserDetailsBody,
  forgotPasswordInput,
  queryConfirmEmail,
  resetPasswordUserInput,
} from "./user.schema";
import UserService from "./user.service";
import { isFileSizeExceeded } from "../../../config/utils/helpers";
import axios from "axios";

const transactionOptions: TransactionOptions = {
  readPreference: "primary",
  readConcern: { level: "local" },
  writeConcern: { w: "majority" },
};

class UserController {
  constructor(private client: MongoClient, private userService: UserService) {
    this.userService = userService;
    this.client = client;
  }

  private static handleError(
    reply: FastifyReply,
    errorCode: number,
    customError?: string
  ) {
    let error;
    if (customError !== undefined) {
      switch (errorCode) {
        case 403:
          error = createError("403", customError);
          break;
        case 401:
          error = createError("401", customError);
          break;
        case 500:
          error = createError("500", customError);
          break;
        default:
          error = createError("400", customError);
          break;
      }
    } else {
      switch (errorCode) {
        case 403:
          error = createError("403", "Forbidden");
          break;
        case 401:
          error = createError("401", "Unauthorized");
          break;
        case 500:
          error = createError("500", "Internal server error");
          break;
        default:
          error = createError("400", "Invalid request");
          break;
      }
    }
    reply.code(errorCode).send(error);
    return;
  }

  private static verifyQueryToken(query: {
    token?: string;
  }): TokenInterface | null {
    try {
      const token = query.token;
      if (!token) throw new Error("Invalid token");

      const data = verifyJWT(token!, EnvironmentVariables.Email_Secret);
      if (!data?.userId || !data?.type) throw new Error("Invalid token data");

      return data;
    } catch (error) {
      return null;
    }
  }

  async registerCredentialsHandler(
    request: FastifyRequest<{ Body: credentialsUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body;
      const session = this.client.startSession();
      try {
        await session.withTransaction(async () => {
          const serviceResponse: ServiceResponse =
            await this.userService.InsertUserWithCredentials(
              email.toLowerCase(),
              password
            );

          const insertedCorrectly: boolean = serviceResponse.success;
          if (insertedCorrectly === false) {
            return UserController.handleError(
              reply,
              400,
              serviceResponse?.customError
            );
          }

          const email_token = generateJWT(
            {
              userId: serviceResponse.data!.userId.toString(),
              type: Strings.ConfirmEmailType,
            },
            EnvironmentVariables.Email_Secret,
            EnvironmentVariables.Email_Token_Expiration_Time
          );

          sendEmail(email, email_token, Strings.ActionConfirmEmail);
          reply.code(201).send();
        }, transactionOptions);
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        await session.endSession();
      }
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async confirmEmailHandler(
    request: FastifyRequest<{ Querystring: queryConfirmEmail }>,
    reply: FastifyReply
  ) {
    try {
      const tokenVerifiedData = UserController.verifyQueryToken(request.query);
      if (tokenVerifiedData === null) {
        return UserController.handleError(reply, 400, Errors.TokenExpired);
      }

      const hasConfirmedEmail: ServiceResponse =
        await this.userService.CheckUserEmailConfirmation(
          request.query.email.toLowerCase()
        );

      if (hasConfirmedEmail.success === false) {
        const { userId, type } = tokenVerifiedData;
        if (type !== Strings.ConfirmEmailType) {
          return UserController.handleError(reply, 400, Errors.IncorrectToken);
        }

        const serviceResponse: ServiceResponse =
          await this.userService.UpdateIsVerifiedWhenUserExists(userId);

        const doneVerified: boolean = serviceResponse.success;
        if (doneVerified === false) {
          return UserController.handleError(
            reply,
            400,
            serviceResponse?.customError
          );
        }
      }
      reply.code(200).send();
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  /**
   * @todo Check if email changed by user on facebook; if yes, cheange it.
   * @todo Inside initial insert; if you retrieve user image, insert it as well.
   */
  async loginFacebookHandler(
    request: FastifyRequest<{ Body: { code: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { code } = request.body;

      if (!code) {
        return UserController.handleError(reply, 400, Errors.GenericError);
      }

      const fbRetrieveTokenUri = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${EnvironmentVariables.Facebook_App_Id}&redirect_uri=${EnvironmentVariables.Facebook_App_Redirect_Uri}&client_secret=${EnvironmentVariables.Facebook_App_Secret}&code=${code}`;

      const tokenResponse = await axios.get(fbRetrieveTokenUri, {
        headers: { Origin: EnvironmentVariables.ServerUri },
      });

      if (!tokenResponse?.data?.access_token) {
        return UserController.handleError(reply, 400, Errors.GenericError);
      }

      const userResponse = await axios.get(
        `https://graph.facebook.com/me?fields=id,email,name,about&access_token=${tokenResponse.data.access_token}`,
        {
          headers: { Origin: EnvironmentVariables.ServerUri },
        }
      );

      if (!userResponse?.data?.email || !userResponse?.data?.name) {
        return UserController.handleError(
          reply,
          400,
          Errors.NotRetrievedFacebook
        );
      }

      let userId: string | undefined = undefined;
      const checkIfEmailWithGivenSocialPlatformExists: ServiceResponse =
        await this.userService.CheckGivenSocialPlatformEmailExistence(
          userResponse.data.email,
          "facebook"
        );

      const givenSocialPlatformEmailExist: boolean =
        checkIfEmailWithGivenSocialPlatformExists.success;
      if (givenSocialPlatformEmailExist === true) {
        userId =
          checkIfEmailWithGivenSocialPlatformExists.data!.userId.toString();
      }

      /**
       * Start of register user operation
       */
      const { access_token, refresh_token } = generateAuthJWTs(
        userId!,
        "facebook"
      );
      if (givenSocialPlatformEmailExist === false) {
        const userSocialLoginResponse: ServiceResponse =
          await this.userService.InsertUserWithSocialAccount(
            userResponse.data.name,
            userResponse.data.email.toLowerCase(),
            userResponse.data.about ?? "",
            refresh_token,
            "facebook"
          );

        const inserted: boolean = userSocialLoginResponse.success;
        if (inserted === false) {
          return UserController.handleError(
            reply,
            400,
            userSocialLoginResponse?.customError
          );
        }
        userId = userSocialLoginResponse.data!.userId.toString();
      }
      const cookieOptions = generateSocialCookieOptions();

      reply
        .code(200)
        .setCookie(
          EnvironmentVariables.Cookie_Name,
          refresh_token,
          cookieOptions
        )
        .setCookie(
          EnvironmentVariables.Cookie_Name_Social_Profile,
          tokenResponse.data.access_token,
          cookieOptions
        )
        .send({ access_token: access_token });
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async loginCredentialsHandler(
    request: FastifyRequest<{ Body: credentialsUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body;

      const userCredsResponse: ServiceResponse =
        await this.userService.ValidateUserWithCredentials(
          email.toLowerCase(),
          password
        );

      const credentialsAuthenticated: boolean = userCredsResponse.success;
      if (credentialsAuthenticated === false) {
        return UserController.handleError(
          reply,
          400,
          userCredsResponse?.customError
        );
      }

      const hasConfirmedEmail: ServiceResponse =
        await this.userService.CheckUserEmailConfirmation(email.toLowerCase());

      if (hasConfirmedEmail.success === false) {
        const new_email_token = generateJWT(
          {
            userId: userCredsResponse.data!.userId.toString(),
            type: Strings.ConfirmEmailType,
          },
          EnvironmentVariables.Email_Secret,
          EnvironmentVariables.Email_Token_Expiration_Time
        );

        sendEmail(email, new_email_token, Strings.ActionConfirmEmail);

        return UserController.handleError(
          reply,
          403,
          Errors.ConfirmEmailInOrderToContinue
        );
      }

      const { access_token, refresh_token } = generateAuthJWTs(
        userCredsResponse.data!.userId.toString()
      );
      await this.userService.updateUserRefreshToken(
        email.toLowerCase(),
        refresh_token
      );

      const cookieOptions = generateCookieOptions();

      reply
        .code(200)
        .setCookie(
          EnvironmentVariables.Cookie_Name,
          refresh_token,
          cookieOptions
        )
        .send({ access_token: access_token });
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async forgotPasswordHandler(
    request: FastifyRequest<{ Body: forgotPasswordInput }>,
    reply: FastifyReply
  ) {
    try {
      const { email } = request.body;

      const serviceResponse: ServiceResponse =
        await this.userService.CheckEmailExistence(email.toLowerCase());

      const emailExists: boolean = serviceResponse.success;

      const hasConfirmedEmail: ServiceResponse =
        await this.userService.CheckUserEmailConfirmation(email.toLowerCase());

      const emailConfirmed: boolean = hasConfirmedEmail.success;

      if (emailExists === true && emailConfirmed === true) {
        const new_email_token = generateJWT(
          {
            userId: serviceResponse.data!.userId.toString(),
            type: Strings.ForgotPasswordType,
          },
          EnvironmentVariables.Email_Secret,
          EnvironmentVariables.Email_Token_Expiration_Time
        );

        sendEmail(email, new_email_token, Strings.ActionResetPassword);

        const reset_password_cookie_token = generateJWT(
          {
            userId: serviceResponse.data!.userId.toString(),
            type: Strings.ForgotPasswordType,
          },
          EnvironmentVariables.Reset_Pass_Cookie_Secret,
          EnvironmentVariables.Reset_Pass_Cookie_Expiration_Time
        );

        const cookieOptions = generateResetCookieOptions();

        reply
          .code(200)
          .setCookie(
            EnvironmentVariables.Reset_Pass_Cookie_Name,
            reset_password_cookie_token,
            cookieOptions
          );
      }

      reply.code(200).send();
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async renewTokens(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, signInMethod } = request;

      const { access_token, refresh_token } = generateAuthJWTs(
        userId,
        signInMethod
      );
      await this.userService.updateUserRefreshTokenById(userId, refresh_token);

      const cookieOptions = generateCookieOptions();

      reply
        .code(200)
        .setCookie(
          EnvironmentVariables.Cookie_Name,
          refresh_token,
          cookieOptions
        )
        .send({ access_token: access_token });
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async resetPasswordHandler(
    request: FastifyRequest<{
      Querystring: queryConfirmEmail;
      Body: resetPasswordUserInput;
    }>,
    reply: FastifyReply
  ) {
    try {
      const tokenVerifiedData = UserController.verifyQueryToken(request.query);
      if (tokenVerifiedData === null) {
        return UserController.handleError(
          reply,
          403,
          Errors.GenericErrorResetPassword
        );
      }

      const { userId, type } = tokenVerifiedData;
      if (type !== Strings.ForgotPasswordType) {
        return UserController.handleError(
          reply,
          403,
          Errors.IncorrectResetToken
        );
      }
      const userExistsResponse: ServiceResponse =
        await this.userService.CheckUserIdExistence(userId);

      if (userExistsResponse.success === false) {
        return UserController.handleError(
          reply,
          403,
          Errors.GenericErrorResetPassword
        );
      }

      const { newPassword, confirmNewPassword } = request.body;
      if (newPassword !== confirmNewPassword) {
        return UserController.handleError(reply, 400, Errors.PasswordsNotSame);
      }
      const resetPasswordById: ServiceResponse =
        await this.userService.ResetPassword(userId, newPassword);

      if (resetPasswordById.success === false) {
        return UserController.handleError(
          reply,
          400,
          Errors.GenericErrorResetPassword
        );
      }

      reply
        .code(200)
        .clearCookie(
          EnvironmentVariables.Reset_Pass_Cookie_Name,
          generateCookieOptionsToClear(true)
        );
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async retrieveUserDetails(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userDetails: ServiceResponse =
        await this.userService.RetrieveUserDetails(request.userId ?? "");

      if (userDetails.success === false) {
        return UserController.handleError(reply, 400, userDetails?.customError);
      }

      const { username, email, phone, biography, signInMethod, image } =
        userDetails.data as ServiceInsertedData;

      let imageString: string | undefined = undefined;
      if (image?.data !== undefined) {
        const bufferToBase64String: string = image.data.toString("base64");
        imageString = `data:${image?.mimetype};base64,${bufferToBase64String}`;
      }

      reply.code(200).send({
        username: username,
        email: email,
        phone: phone,
        biography: biography,
        signInMethod: signInMethod,
        image: imageString,
      });
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async updateUserDetails(
    request: FastifyRequest<{
      Body: editUserDetailsBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { username, biography, phone, currentPassword, newPassword } =
        request.body;
      const images = request.body.file as Array<UploadedFile>;

      let image: UploadedFile | null = (images[0] as UploadedFile) || null;

      if (image !== null) {
        if (!image.data || image.data.length === 0) {
          image = null;
        }
        if (isFileSizeExceeded(image) === true) {
          return UserController.handleError(
            reply,
            400,
            Errors.MaxFileSizeExceeded
          );
        }
      }

      const isChangingPassword: boolean = newPassword !== "";

      const signInMethod = request.signInMethod;
      const canChangePassword: boolean = signInMethod === "credentials";

      if (isChangingPassword === true && canChangePassword === false) {
        return UserController.handleError(
          reply,
          400,
          Errors.SignInMethodUpdatePassword
        );
      }

      const session = this.client.startSession();
      try {
        await session.withTransaction(async () => {
          if (isChangingPassword === true) {
            const verifyUserPassword =
              await this.userService.ValidateUserPassword(
                request.userId,
                currentPassword
              );

            if (verifyUserPassword.success === false) {
              return UserController.handleError(
                reply,
                400,
                Errors.IncorrectPassword
              );
            }
          }

          const updatedUserDetails = await this.userService.UpdateUserDetails(
            request.userId,
            username,
            phone,
            biography,
            newPassword,
            image
          );

          if (updatedUserDetails.success === false) {
            return UserController.handleError(
              reply,
              400,
              updatedUserDetails?.customError
            );
          }

          reply.code(200).send();
        }, transactionOptions);
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        await session.endSession();
      }
    } catch (error) {
      UserController.handleError(reply, 500, Errors.GenericError);
    }
  }

  async logout(_: FastifyRequest, reply: FastifyReply) {
    return reply
      .code(200)
      .clearCookie(
        EnvironmentVariables.Cookie_Name,
        generateCookieOptionsToClear()
      )
      .clearCookie(
        EnvironmentVariables.Cookie_Name_Social_Profile,
        generateCookieOptionsToClear()
      )
      .send({ message: "Logged out successfully" });
  }

  async checkIfUserIsAuthenticated(_: FastifyRequest, reply: FastifyReply) {
    reply.code(403).send();
  }
}

export default UserController;
