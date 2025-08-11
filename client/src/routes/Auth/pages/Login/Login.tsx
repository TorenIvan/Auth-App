import { FormEvent, Fragment, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { isEmailValid, isPasswordValid } from "../../../../helpers";
import { Constants } from "../../constants";
import { Errors } from "../../errors";
import { useAuth } from "../../../../store";
import {
  LoginTitle,
  LoginNavLink,
  ForgotPasswordLink,
  AuthFormGroup,
} from "../../components";
import { useQueryClient } from "@tanstack/react-query";

// type SocialItem = "facebook" | "google" | "twitter" | "github";

export function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuth();

  const title = useMemo(() => LoginTitle(), []);
  const navigateLink = useMemo(() => LoginNavLink(), []);
  const forgotPasswordLink = useMemo(() => ForgotPasswordLink(), []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!isEmailValid(email)) {
          toast.error(Errors.InvalidEmail);
          return;
        }
        if (!isPasswordValid(password)) {
          toast.error(Errors.InvalidPassword);
          return;
        }

        await login({ email, password });
        await queryClient.cancelQueries();
        queryClient.clear();
        navigate("/profile");
      } catch (error) {
        toast.error(String(error));
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
          submitButtonText={Constants.SignInButtonText}
          forgotPasswordSlot={forgotPasswordLink}
        />
        <AuthFormGroup.Footer navLinkSlot={navigateLink} />
      </Fragment>
    </AuthFormGroup>
  );
}
