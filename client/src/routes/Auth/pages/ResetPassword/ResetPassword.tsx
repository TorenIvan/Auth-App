import React, { useRef } from "react";
import { PasswordInput } from "../../../../components";
import { validatePassword } from "../../helpers";
import { Errors } from "../../errors";
import { toast } from "react-hot-toast";
import { ActionFunctionArgs, Form, redirect } from "react-router-dom";
import { Constants } from "../../constants";
import styles from "./styles.module.scss";
import { inputStyles } from "../../../../styles";
import { checkIfUserIsAuthenticated } from "../../../../api";
import { resetPassword } from "../../api";

function ResetPassword() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const password = passwordRef.current?.value ?? "";
    const passwordConfirm = passwordConfirmRef.current?.value ?? "";

    if (!validatePassword(password) || !validatePassword(passwordConfirm)) {
      toast.error(Errors.InvalidPassword);
      event.preventDefault();
      return;
    }
  }

  return (
    <Form
      autoComplete="off"
      method="post"
      action=""
      className={styles["form-container"]}
      onSubmit={handleSubmit}
    >
      <section id={styles.header}>
        <h2>{Constants.ForgotPassword}</h2>
        <p>{Constants.ForgotPasswordParagraph}</p>
      </section>
      <section id={styles.main}>
        <div className={styles["auth-item"]}>
          <PasswordInput
            ref={passwordRef}
            attributes={{
              id: "password",
              name: "password",
              autoComplete: "new-password",
              placeholder: "Enter your new password",
              readOnly: true,
              required: true,
            }}
            preventCopyPasteEnabled
            iconStyles={inputStyles["fa-eye"]}
          />
        </div>
        <div className={styles["auth-item"]}>
          <PasswordInput
            ref={passwordConfirmRef}
            attributes={{
              id: "confirm-password",
              name: "confirm-password",
              autoComplete: "new-password",
              placeholder: "Confirm your new password",
              readOnly: true,
              required: true,
            }}
            preventCopyPasteEnabled
            iconStyles={inputStyles["fa-eye"]}
          />
        </div>
        <div id={styles["submitBox"]}>
          <input type="submit" value={Constants.ResetPassword}></input>
        </div>
      </section>
    </Form>
  );
}

export { ResetPassword, loader, action };

async function loader() {
  try {
    const isAuthenticated: boolean = await checkIfUserIsAuthenticated();

    if (isAuthenticated) {
      toast.error(Errors.AlreadyAuthenticatedOnReset);
      return redirect(`${import.meta.env.VITE_CLIENT_URI}profile`);
    }

    const { search } = window.location;
    if (!search) {
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }

    const urlParams = new URLSearchParams(search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    if (!token || !email) {
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }

    return true;
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : (error as string));
    return false;
  }
}

async function action({ request }: ActionFunctionArgs) {
  try {
    const { search } = window.location;
    if (!search) {
      toast.error(Errors.NoConfirmationToken);
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }

    const urlParams = new URLSearchParams(search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    if (!token || !email) {
      toast.error(Errors.InvalidConfirmationToken);
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }

    const response = await request.formData();
    const password = (response.get("password") as string).trim();
    const confirmPassword = (response.get("confirm-password") as string).trim();

    const isOperationSuccessful: boolean = await resetPassword(
      email,
      token,
      password,
      confirmPassword
    );
    if (isOperationSuccessful === false) {
      toast.error(Errors.GenericError);
      return true;
    }
    toast.success(Constants.PasswordResetedMessage);
    return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
  } catch (error: unknown) {
    if ((error as ForbiddenError)?.isForbidden === true) {
      const errorMessage = (error as ForbiddenError)?.message ?? null;
      if (errorMessage !== null) toast.error(errorMessage);
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }
    toast.error(error instanceof Error ? error.message : (error as string));
    return false;
  }
}

interface ForbiddenError {
  isForbidden?: boolean;
  message: string;
}
