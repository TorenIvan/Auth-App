import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Constants } from '../../../../utils';
import styles from './styles.module.scss';

export function LoginOAuth({
  isParamsValid,
  isError,
}: {
  isParamsValid: boolean;
  isError: boolean;
}) {
  const navigate = useNavigate();
  const goBackToLogin = useCallback(() => {
    navigate('/login');
  }, []);

  if (!isParamsValid || isError) {
    return (
      <div id={styles.container}>
        <h2 id={styles.header}>{Constants.LoginHeaderError}</h2>
        <FontAwesomeIcon icon={faCircleXmark} className={styles.fontIconError} beatFade />
        <p id={styles.content}>
          <em>{Constants.LoginParagraphError}</em>
        </p>
        <button id={styles.button} onClick={goBackToLogin}>
          <span>{Constants.BackToSignIn}</span>
        </button>
      </div>
    );
  }

  return (
    <div id={styles.container}>
      <h2 id={styles.header}>{Constants.LoginHeaderLoading}</h2>
      <FontAwesomeIcon icon={faSpinner} className={styles.fontIcon} spinPulse />
      <p id={styles.content}>
        <em>{Constants.ConfirmParagraphLoading}</em>
      </p>
    </div>
  );
}
