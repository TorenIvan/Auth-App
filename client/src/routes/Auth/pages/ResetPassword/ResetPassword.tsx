import React, { useRef } from "react";
import { PasswordInput } from "../../../../components";
import { validatePassword } from "../../helpers";
import { Errors } from "../../errors";
import { toast } from "react-hot-toast";
import { Form } from "react-router-dom";
import { Constants } from "../../constants";
import styles from "./styles.module.scss";
import { inputStyles } from "../../../../styles";

function ResetPassword() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const password = passwordRef.current?.value ?? "";
    const passwordConfirm = passwordConfirmRef.current?.value ?? "";

    if (
      validatePassword(password) === false ||
      validatePassword(passwordConfirm) === false
    ) {
      toast.error(Errors.InvalidPassword);
      event.preventDefault();
      return;
    }
  }

  return (
    <Form
      autoComplete="off"
      method="post"
      action="login"
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

export { ResetPassword as default, action };

async function action() {}
