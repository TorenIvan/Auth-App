import { FastifyReply, FastifyRequest } from 'fastify';
import { Errors } from '../../../config/utils/constants/Errors';
import AuthService from '../../auth/v1/auth.service';
import { editUserDetailsBody } from './user.schema';
import UserService from './user.service';

class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  private static handleError(reply: FastifyReply, errorCode: number, customError?: string) {
    let error;
    switch (errorCode) {
      case 403:
        error = customError ?? 'Forbidden';
        break;
      case 401:
        error = customError ?? 'Unauthorized';
        break;
      case 500:
        error = customError ?? 'Internal server error';
        break;
      default:
        error = customError ?? 'Invalid request';
        break;
    }
    reply.code(errorCode).send(error);
  }

  async retrieveUserDetails(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userDetails: ServiceResponse = await this.userService.RetrieveUserDetails(
        request.userId ?? ''
      );

      if (userDetails.success === false) {
        return UserController.handleError(reply, 400, userDetails?.customError);
      }

      const { username, email, phone, biography, signInMethod, image } =
        userDetails.data as ServiceInsertedData;

      let imageString: string | undefined = undefined;
      if (image?.data !== undefined) {
        const bufferToBase64String: string = image.data.toString('base64');
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
      const { username, biography, phone, currentPassword, newPassword } = request.body;
      const images = request.body.file as Array<UploadedFile>;
      let image: UploadedFile | null = images ? (images[0] as UploadedFile) || null : null;

      if (image !== null) {
        if (!image.data || image.data.length === 0) {
          image = null;
        }
      }

      const isChangingPassword: boolean = newPassword !== '';
      const signInMethod = request.signInMethod;
      const canChangePassword: boolean = signInMethod === 'credentials';

      if (isChangingPassword === true && canChangePassword === false) {
        return UserController.handleError(reply, 400, Errors.SignInMethodUpdatePassword);
      }

      if (isChangingPassword === true) {
        const verifyUserPassword = await this.authService.ValidateUserPassword(
          request.userId,
          currentPassword
        );

        if (verifyUserPassword.success === false) {
          return UserController.handleError(reply, 400, Errors.IncorrectPassword);
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
        return UserController.handleError(reply, 400, updatedUserDetails?.customError);
      }

      return reply.code(200).send();
    } catch (error) {
      return UserController.handleError(reply, 500, Errors.GenericError);
    }
  }
}

export default UserController;
