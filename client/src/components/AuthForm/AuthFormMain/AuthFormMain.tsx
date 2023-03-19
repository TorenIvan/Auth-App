import { useRef } from "react";
import { useThrowErrorToBoundary } from "../../../hooks/Modules/useThrowErrorToBoundary";
import styles from "./styles.module.scss";

interface IProps {
  onFormSubmit: (arg: any) => void;
  submitButtonText: string;
}

const AuthFormMain = (props: IProps): JSX.Element => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const throwAsyncError = useThrowErrorToBoundary();

  const { onFormSubmit, submitButtonText } = props;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    let validEmail: boolean = false;
    if (passwordRef.current !== null) {
      validEmail = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/.test(
        emailRef as unknown as string
      );
    }
    if (validEmail === false) {
      console.log("edo poses fores mpikes");

      throwAsyncError("Email wrong format");
      return;
    }

    let validPassword: boolean = false;
    if (passwordRef.current !== null) {
      validPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/.test(
        passwordRef.current as unknown as string
      );
    }
    if (validPassword === false) {
      throwAsyncError("Password wrong format");
      return;
    }
    const formValue = {
      email: emailRef.current,
      password: passwordRef.current,
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
