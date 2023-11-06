import { Fragment } from "react";
import { ActionFunctionArgs, Form, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { InputGroup } from "../../../../components";
import { isPasswordValid } from "../../../../helpers";
import { checkIfUserIsAuthenticated } from "../../../../api";
import { inputStyles } from "../../../../styles";
import { Errors } from "../../errors";
import { Constants } from "../../constants";
import { resetPassword } from "../../api";
import styles from "./styles.module.scss";

function ResetPassword() {
  return (
    <Form
      autoComplete="off"
      method="post"
      action={window.location.search}
      className={styles["form-container"]}
    >
      <section id={styles.header}>
        <h2>{Constants.ForgotPassword}</h2>
        <p>{Constants.ForgotPasswordParagraph}</p>
      </section>
      <section id={styles.main}>
        <div className={styles["auth-item"]}>
          <InputGroup>
            {({ hidePassword, togglePasswordVisibility }) => (
              <Fragment>
                <InputGroup.LeftIcon
                  icon={faLock}
                  styles={inputStyles["fa-lock-reset"]}
                />
                <InputGroup.Input
                  attributes={{
                    id: "password",
                    name: "password",
                    autoComplete: "new-password",
                    placeholder: "Enter your new password",
                    readOnly: true,
                    required: true,
                    type: hidePassword === true ? "password" : "text",
                  }}
                  readonlyFocusEnabled
                  preventCopyPasteEnabled
                />
                <InputGroup.RightIcon
                  icon={hidePassword === true ? faEye : faEyeSlash}
                  styles={inputStyles["fa-eye-reset"]}
                  handleClick={togglePasswordVisibility}
                />
              </Fragment>
            )}
          </InputGroup>
        </div>
        <div className={styles["auth-item"]}>
          <InputGroup>
            {({ hidePassword, togglePasswordVisibility }) => (
              <Fragment>
                <InputGroup.LeftIcon
                  icon={faLock}
                  styles={inputStyles["fa-lock-reset"]}
                />
                <InputGroup.Input
                  attributes={{
                    id: "confirm-password",
                    name: "confirm-password",
                    autoComplete: "new-password",
                    placeholder: "Confirm your new password",
                    readOnly: true,
                    required: true,
                    type: hidePassword === true ? "password" : "text",
                  }}
                  readonlyFocusEnabled
                  preventCopyPasteEnabled
                />
                <InputGroup.RightIcon
                  icon={hidePassword === true ? faEye : faEyeSlash}
                  styles={inputStyles["fa-eye-reset"]}
                  handleClick={togglePasswordVisibility}
                />
              </Fragment>
            )}
          </InputGroup>
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
    //const isAuthenticated: boolean = await checkIfUserIsAuthenticated();

    //if (isAuthenticated) {
    //  toast.error(Errors.AlreadyAuthenticatedOnReset);
    //  return redirect(`${import.meta.env.VITE_CLIENT_URI}profile`);
    //}

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

    if (!isPasswordValid(password) || !isPasswordValid(confirmPassword)) {
      toast.error(Errors.InvalidPassword);
      return false;
    }

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
