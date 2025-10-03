import { FormEvent, Fragment, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Errors, Constants } from '../../../../utils';
import { isEmailValid, isPasswordValid } from '../../../../helpers';
import { LoginTitle, LoginNavLink, ForgotPasswordLink, AuthFormGroup } from '../../components';
import { useLoginMutation } from '../../hooks';

export function Login() {
  const { login, isLoggingIn } = useLoginMutation();

  const title = useMemo(() => LoginTitle(), []);
  const navigateLink = useMemo(() => LoginNavLink(), []);
  const forgotPasswordLink = useMemo(() => ForgotPasswordLink(), []);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!isEmailValid(email)) {
        toast.error(Errors.InvalidEmail);
        return;
      }
      if (!isPasswordValid(password)) {
        toast.error(Errors.InvalidPassword);
        return;
      }
      await login({ email, password });
    } catch (error) {
      toast.error(String(error));
    }
  }, []);

  return (
    <AuthFormGroup>
      <Fragment>
        <AuthFormGroup.Header titleSlot={title} />
        <AuthFormGroup.Form
          onSubmit={handleSubmit}
          forgotPasswordSlot={forgotPasswordLink}
          submitButtonText={
            isLoggingIn ? Constants.SignInButtonTextLoad : Constants.SignInButtonText
          }
          isSubmitting={isLoggingIn}
        />
        <AuthFormGroup.Footer navLinkSlot={navigateLink} isSubmitting={isLoggingIn} />
      </Fragment>
    </AuthFormGroup>
  );
}
