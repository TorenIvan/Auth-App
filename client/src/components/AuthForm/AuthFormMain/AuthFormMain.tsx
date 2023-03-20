import { useRef } from "react";
import { emailValidator, passwordValidator } from "../helpers";
import styles from "./styles.module.scss";

interface IProps {
  onFormSubmit: (arg: any) => void;
  submitButtonText: string;
}

const AuthFormMain = (props: IProps): JSX.Element => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { onFormSubmit, submitButtonText } = props;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (emailValidator(emailRef.current?.value ?? "") === false) {
      return;
    }
    if (passwordValidator(passwordRef.current?.value ?? "") === false) {
      return;
    }

    const formValue = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };
    onFormSubmit(formValue);
  };

  return (
    <form className={styles["auth-container"]} onSubmit={handleSubmit}>
      <div className={styles["auth-item"]}>
        <input
          ref={emailRef}
          id="email"
          type="email"
          placeholder="&#xf0e0; Email"
          required
        />
      </div>
      <div className={styles["auth-item"]}>
        <input
          ref={passwordRef}
          id="password"
          type="password"
          placeholder="&#xf06e; Password"
          autoComplete="new-password"
          required
        />
      </div>
      <div id={styles["submitBox"]}>
        <input type="submit" value={submitButtonText}></input>
      </div>
    </form>
  );
};

export default AuthFormMain;
