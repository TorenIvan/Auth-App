import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEnvelopeCircleCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Errors, Constants } from '../../../../utils';
import { confirmEmail } from '../../api';
import styles from './styles.module.scss';

export function ConfirmEmail() {
  const navigate = useNavigate();
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean | null>(null); //Null is the loading state

  useEffect(() => {
    async function checkEmailConfirmation() {
      try {
        const { search } = window.location;
        if (!search) {
          toast.error(Errors.NoConfirmationToken);
          navigate('/login', { replace: true });
          return;
        }

        const urlParams = new URLSearchParams(search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');

        if (!token || !email) {
          toast.error(Errors.InvalidConfirmationToken);
          navigate('/login', { replace: true });
          return;
        }

        await confirmEmail(email, token);
        setIsEmailConfirmed(true);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
        setIsEmailConfirmed(false);
      }
    }

    checkEmailConfirmation();
  }, [navigate]);

  function goBackToLogin() {
    navigate('/login');
  }

  if (isEmailConfirmed === false) {
    return (
      <div id={styles.container}>
        <h2 id={styles.header}>{Constants.ConfirmHeaderError}</h2>
        <FontAwesomeIcon icon={faCircleXmark} className={styles.fontIconError} beatFade />
        <p id={styles.content}>
          <em>{Constants.ConfirmParagraphError}</em>
        </p>
        <button id={styles.button} onClick={goBackToLogin}>
          <span>{Constants.BackToSignIn}</span>
        </button>
      </div>
    );
  }

  if (isEmailConfirmed === true) {
    return (
      <div id={styles.container}>
        <h2 id={styles.header}>{Constants.ConfirmHeader}</h2>
        <FontAwesomeIcon icon={faEnvelopeCircleCheck} className={styles.fontIcon} />
        <p id={styles.content}>
          <em>{Constants.ConfirmParagraph}</em>
        </p>
        <button id={styles.button} onClick={goBackToLogin}>
          <span>{Constants.BackToSignIn}</span>
        </button>
      </div>
    );
  }

  return (
    <div id={styles.container}>
      <h2 id={styles.header}>{Constants.ConfirmHeaderLoading}</h2>
      <FontAwesomeIcon icon={faSpinner} className={styles.fontIcon} spinPulse />
      <p id={styles.content}>
        <em>{Constants.ConfirmParagraphLoading}</em>
      </p>
    </div>
  );
}
