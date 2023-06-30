import React, { useRef } from "react";
import { ActionFunctionArgs, Form, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Input } from "../../../../components";
import { isEmailValid } from "../../../../helpers";
import { inputStyles } from "../../../../styles";
import { Errors } from "../../errors";
import { Constants } from "../../constants";
import { forgotPassword } from "../../api";
import styles from "./styles.module.scss";

function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (isEmailValid(emailRef.current?.value ?? "") === false) {
      toast.error(Errors.InvalidEmail);
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
        <Input
          ref={emailRef}
          preventCopyPasteEnabled
          attributes={{
            id: "email",
            type: "text",
            name: "email",
            placeholder: Constants.EmailPlaceholder,
            autoComplete: "off",
            required: true,
          }}
          leftIconSlot={
            <FontAwesomeIcon
              icon={faEnvelope}
              className={inputStyles["fa-lock-forgot"]}
            />
          }
        />
        <div id={styles["submitBox"]}>
          <input type="submit" value={Constants.Continue}></input>
        </div>
      </section>
    </Form>
  );
}

export { ForgotPassword, action };

async function action({ request }: ActionFunctionArgs) {
  try {
    const response = await request.formData();
    const email = response.get("email") as string;

    const isOperationSuccessful: boolean = await forgotPassword(email.trim());
    if (isOperationSuccessful === false) {
      toast.error(Errors.GenericError);
      return true;
    }
    toast.success(Constants.ResetPasswordEmailMessage);
    return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : (error as string));
    return false;
  }
}
