import { useRef } from "react";
import { Form } from "react-router-dom";
import { toast } from "react-hot-toast";
import { emailValidator, passwordValidator } from "../helpers";
import styles from "./styles.module.scss";
import { Errors } from "../../../utils/Errors";

interface IProps {
  submitButtonText: string;
}

const AuthFormMain = ({ submitButtonText }: IProps): JSX.Element => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (emailValidator(emailRef.current?.value ?? "") === false) {
      toast.error(Errors.InvalidEmail);
      event.preventDefault();
      return;
    }
    if (passwordValidator(passwordRef.current?.value ?? "") === false) {
      toast.error(Errors.InvalidPassword);
      event.preventDefault();
      return;
    }
  }

  return (
    <Form
      method="post"
      action=""
      className={styles["auth-container"]}
      onSubmit={handleSubmit}
    >
      <div className={styles["auth-item"]}>
        <input
          ref={emailRef}
          id="email"
          type="email"
          name="email"
          placeholder="&#xf0e0; Email"
          required
        />
      </div>
      <div className={styles["auth-item"]}>
        <input
          ref={passwordRef}
          id="password"
          type="password"
          name="password"
          placeholder="&#xf06e; Password"
          autoComplete="new-password"
          required
        />
      </div>
      <div id={styles["submitBox"]}>
        <input type="submit" value={submitButtonText}></input>
      </div>
    </Form>
  );
};

export default AuthFormMain;
