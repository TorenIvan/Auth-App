import { Fragment, FormEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import { InputGroup } from '../../../../components';
import { isPasswordValid } from '../../../../helpers';
import { inputStyles } from '../../../../styles';
import { Errors } from '../../errors';
import { Constants } from '../../constants';
import { resetPassword } from '../../api';
import styles from './styles.module.scss';

export function ResetPassword() {
  const navigate = useNavigate();
  const [isMutating, setIsMutating] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        const { search } = window.location;
        if (!search) {
          toast.error(Errors.NoConfirmationToken);
          navigate('/login');
          return;
        }

        const urlParams = new URLSearchParams(search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');

        if (!token || !email) {
          toast.error(Errors.InvalidConfirmationToken);
          navigate('/login');
          return;
        }

        const formData = new FormData(event.currentTarget);
        const password = (formData.get('password') as string).trim();
        const confirmPassword = (formData.get('confirm-password') as string).trim();

        if (!isPasswordValid(password) || !isPasswordValid(confirmPassword)) {
          toast.error(Errors.InvalidPassword);
          return;
        }

        setIsMutating(true);
        const isOperationSuccessful = await resetPassword(email, token, password, confirmPassword);
        if (!isOperationSuccessful) {
          toast.error(Errors.GenericError);
          return;
        }
        toast.success(Constants.PasswordResetMessage);
        setIsMutating(false);
        navigate('/login');
      } catch (error) {
        setIsMutating(false);
        if ((error as ForbiddenError)?.isForbidden) {
          const errorMessage = (error as ForbiddenError)?.message ?? null;
          if (errorMessage) toast.error(errorMessage);
          navigate('/login');
        } else {
          toast.error(error instanceof Error ? error.message : String(error));
        }
      }
    },
    [navigate]
  );

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles['form-container']}>
      <section id={styles.header}>
        <h2>{Constants.ForgotPassword}</h2>
        <p>{Constants.ForgotPasswordParagraph}</p>
      </section>
      <section id={styles.main}>
        <div className={styles['auth-item']}>
          <InputGroup>
            {({ hidePassword, togglePasswordVisibility }) => (
              <Fragment>
                <InputGroup.LeftIcon icon={faLock} styles={inputStyles['fa-lock-reset']} />
                <InputGroup.Input
                  attributes={{
                    id: 'password',
                    name: 'password',
                    autoComplete: 'new-password',
                    placeholder: 'Enter your new password',
                    readOnly: true,
                    required: true,
                    type: hidePassword ? 'password' : 'text',
                  }}
                  readonlyFocusEnabled
                  preventCopyPasteEnabled
                />
                <InputGroup.RightIcon
                  icon={hidePassword ? faEye : faEyeSlash}
                  styles={inputStyles['fa-eye-reset']}
                  handleClick={togglePasswordVisibility}
                />
              </Fragment>
            )}
          </InputGroup>
        </div>
        <div className={styles['auth-item']}>
          <InputGroup>
            {({ hidePassword, togglePasswordVisibility }) => (
              <Fragment>
                <InputGroup.LeftIcon icon={faLock} styles={inputStyles['fa-lock-reset']} />
                <InputGroup.Input
                  attributes={{
                    id: 'confirm-password',
                    name: 'confirm-password',
                    autoComplete: 'new-password',
                    placeholder: 'Confirm your new password',
                    readOnly: true,
                    required: true,
                    type: hidePassword ? 'password' : 'text',
                  }}
                  readonlyFocusEnabled
                  preventCopyPasteEnabled
                />
                <InputGroup.RightIcon
                  icon={hidePassword ? faEye : faEyeSlash}
                  styles={inputStyles['fa-eye-reset']}
                  handleClick={togglePasswordVisibility}
                />
              </Fragment>
            )}
          </InputGroup>
        </div>
        <div id={styles['submitBox']}>
          <input
            type="submit"
            value={isMutating ? Constants.Resetting : Constants.ResetPassword}
            disabled={isMutating === true}
            data-loading={isMutating ? 'true' : 'false'}
          />
        </div>
      </section>
    </form>
  );
}
interface ForbiddenError {
  isForbidden?: boolean;
  message: string;
}
