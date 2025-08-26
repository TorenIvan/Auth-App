import { FormEvent, Fragment, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { InputGroup } from '../../../../components';
import { isEmailValid } from '../../../../helpers';
import { inputStyles } from '../../../../styles';
import { Errors } from '../../errors';
import { Constants } from '../../constants';
import { forgotPassword } from '../../api';
import styles from './styles.module.scss';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [isMutating, setIsMutating] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        const formData = new FormData(event.currentTarget);
        const email = (formData.get('email') as string).trim();

        if (!isEmailValid(email)) {
          toast.error(Errors.InvalidEmail);
          return;
        }

        setIsMutating(true);
        const isOperationSuccessful = await forgotPassword(email);
        if (!isOperationSuccessful) {
          toast.error(Errors.GenericError);
          return;
        }

        toast.success(Constants.ResetPasswordEmailMessage);
        setIsMutating(false);
        navigate('/login');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
        setIsMutating(false);
      }
    },
    [navigate]
  );

  return (
    <form autoComplete="off" className={styles['form-container']} onSubmit={handleSubmit}>
      <section id={styles.header}>
        <h2>{Constants.ForgotPassword}</h2>
        <p>{Constants.ForgotPasswordParagraph}</p>
      </section>
      <section id={styles.main}>
        <InputGroup>
          <Fragment>
            <InputGroup.LeftIcon icon={faEnvelope} styles={inputStyles['fa-lock-forgot']} />
            <InputGroup.Input
              attributes={{
                id: 'email',
                type: 'text',
                name: 'email',
                placeholder: Constants.EmailPlaceholder,
                autoComplete: 'off',
                required: true,
              }}
              preventCopyPasteEnabled
            />
          </Fragment>
        </InputGroup>
        <div id={styles['submitBox']}>
          <input
            type="submit"
            value={isMutating ? Constants.Continuing : Constants.Continue}
            disabled={isMutating === true}
            data-loading={isMutating ? 'true' : 'false'}
          />
        </div>
      </section>
    </form>
  );
}
