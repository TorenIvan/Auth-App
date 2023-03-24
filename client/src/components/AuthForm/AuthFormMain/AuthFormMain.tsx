import { useRef } from "react";
import { Form } from "react-router-dom";
import { emailValidator, passwordValidator } from "../helpers";
import styles from "./styles.module.scss";

interface IProps {
  submitButtonText: string;
}

const AuthFormMain = ({ submitButtonText }: IProps): JSX.Element => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (emailValidator(emailRef.current?.value ?? "") === false) {
      event.preventDefault();
    }
    if (passwordValidator(passwordRef.current?.value ?? "") === false) {
      event.preventDefault();
    }
  };

  return (
    <Form
      method="post"
      action="action"
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
