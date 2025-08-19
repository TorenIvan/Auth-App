import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Errors } from '../../errors';
import { Constants } from '../../constants';
import { useFacebookLoginMutation } from '../../hooks';
import styles from './styles.module.scss';

export function LoginFacebook() {
  const navigate = useNavigate();
  const [isParamsValid, setIsParamsValid] = useState(true);
  const { isError, mutate } = useFacebookLoginMutation();

  /**
   * *** Extract params from URL ***
   */
  const { search } = window.location;
  const urlParams = new URLSearchParams(search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  /*
   * *** Validate params + CSRF only once on mount ***
   */
  useEffect(() => {
    let valid = true;

    if (!search || !code || !state) {
      toast.error(Errors.InvalidQueryParameters);
      localStorage.removeItem('auth_app_csrf_token');
      valid = false;
    } else {
      const csrfToken = extractCSRFToken(state);
      const csrfTokenLocalStorage = localStorage.getItem('auth_app_csrf_token');
      console.log({ csrfToken, csrfTokenLocalStorage });
      if (csrfToken !== csrfTokenLocalStorage) {
        toast.error(Errors.InvalidCSRFToken);
        localStorage.removeItem('auth_app_csrf_token');
        valid = false;
      }
    }

    setIsParamsValid(valid);
  }, [search, code, state]);

  /**
   * *** Trigger mutation once validation passes ***
   */
  useEffect(() => {
    console.log({ isParamsValid, code });

    if (isParamsValid && code) {
      mutate(decodeURI(code));
    }
  }, [isParamsValid, code, mutate]);

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

function extractCSRFToken(state: string | null | undefined): string | undefined {
  if (!state) return undefined;
  return decodeURIComponent(state);
}
