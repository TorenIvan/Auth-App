import { FormEvent, Fragment, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { isEmailValid, isPasswordValid } from '../../../../helpers';
import { registerUser } from '../../api';
import { Errors, Constants } from '../../../../utils';
import { RegisterTitle, RegisterNavLink, AuthFormGroup } from '../../components';

export function Register() {
  const [isMutating, setIsMutating] = useState(false);
  const navigate = useNavigate();

  const title = useMemo(() => RegisterTitle(), []);
  const navigateLink = useMemo(() => RegisterNavLink(), []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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

        setIsMutating(true);
        await registerUser({ email, password });
        toast.success(Constants.ConfirmEmailMessage);
        navigate('../login');
      } catch (error) {
        toast.error(String(error));
        if (error === Errors.AUserAlreadyAuthenticated) {
          navigate('../profile');
        }
      } finally {
        setIsMutating(false);
      }
    },
    [navigate]
  );

  return (
    <AuthFormGroup>
      <Fragment>
        <AuthFormGroup.Header titleSlot={title} />
        <AuthFormGroup.Form
          onSubmit={handleSubmit}
          submitButtonText={isMutating ? Constants.Registering : Constants.RegisterButtonText}
          isSubmitting={isMutating}
        />
        <AuthFormGroup.Footer navLinkSlot={navigateLink} isSubmitting={isMutating} />
      </Fragment>
    </AuthFormGroup>
  );
}
