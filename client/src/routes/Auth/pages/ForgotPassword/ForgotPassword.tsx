import React, { useRef } from "react";
import { Input } from "../../../../components";
import { emailValidator } from "../../helpers";
import { Errors } from "../../errors";
import { toast } from "react-hot-toast";
import { Form } from "react-router-dom";
import { Constants } from "../../constants";
import styles from "./styles.module.scss";

function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (emailValidator(emailRef.current?.value ?? "") === false) {
      toast.error(Errors.InvalidEmail);
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
      <section>
        <p>{Constants.ForgotPassword}</p>
      </section>
      <section>
        <Input
          ref={emailRef}
          attributes={{
            id: "email",
            type: "text",
            name: "email",
            placeholder: Constants.EmailPlaceholder,
            autoComplete: "off",
            required: true,
          }}
        />
        <div id={styles["submitBox"]}>
          <input type="submit" value={Constants.Continue}></input>
        </div>
      </section>
    </Form>
  );
}

export { ForgotPassword as default, action };

async function action() {}
