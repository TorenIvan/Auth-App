import { toast } from 'react-hot-toast';
import { isPasswordValid } from '../../../../helpers';
import { Errors } from '../../errors';
import { isUsernameValid } from './isUsernameValid';
import { isBiographyValid } from './isBiographyValid';
import { isPhoneValid } from './isPhoneValid';

export function isEditFormValid(formData: FormData): boolean {
  for (const [key, value] of formData.entries()) {
    const keyString = key as string;
    const valueString = value as string;

    switch (keyString) {
      case 'username':
        if (isUsernameValid(valueString) === false) {
          toast.error(Errors.InvalidUsername);
          return false;
        }
        break;

      case 'biography':
        if (isBiographyValid(valueString) === false) {
          toast.error(Errors.InvalidBiography);
          return false;
        }
        break;

      case 'phone':
        if (isPhoneValid(valueString) === false) {
          toast.error(Errors.InvalidPhoneNumber);
          return false;
        }
        break;

      case 'currentPassword':
      case 'newPassword':
        // eslint-disable-next-line no-case-declarations
        const isPasswordEmpty: boolean = valueString.trim().length === 0;
        if (!isPasswordEmpty && isPasswordValid(valueString) === false) {
          if (keyString === 'currentPassword') {
            toast.error(Errors.InvalidCurrentPassword);
          }
          if (keyString === 'newPassword') {
            toast.error(Errors.InvalidNewPassword);
          }
          return false;
        }
        break;
    }
  }

  return true;
}
