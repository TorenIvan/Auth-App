import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Errors } from '../../errors';
import { useLinkedinLoginMutation } from '../../hooks';
import { LoginOAuth } from '../../components';

export function LoginLinkedin() {
  const [isParamsValid, setIsParamsValid] = useState(true);
  const { isError, mutate } = useLinkedinLoginMutation();

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
    if (isParamsValid && code) {
      mutate(decodeURI(code));
    }
  }, [isParamsValid, code, mutate]);

  return <LoginOAuth isParamsValid={isParamsValid} isError={isError} />;
}

function extractCSRFToken(state: string | null | undefined): string | undefined {
  if (!state) return undefined;
  return decodeURIComponent(state);
}
