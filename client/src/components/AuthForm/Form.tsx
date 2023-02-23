import { useRef } from "react";
import styles from "./Styles/authStyles.module.css";
import inputStyles from "./Styles/authInput.module.css";

interface IProps {
  onFormSubmit: (arg: any) => void;
  submitButtonText: string;
}

const AuthForm = (props: IProps): JSX.Element => {
  const { onFormSubmit, submitButtonText } = props;
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //validate common (Login/Register) things
    const formValue = {
      email: emailRef.current,
      password: passwordRef.current,
    };
    onFormSubmit(formValue);
  };

  return (
    <form className={styles["auth-container"]} onSubmit={handleSubmit}>
      <div className={inputStyles["auth-item"]}>
        <input
          ref={emailRef}
          id="email"
          type="email"
          placeholder="&#xf0e0; Email"
          pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"
          required
        />
      </div>
      <div className={inputStyles["auth-item"]}>
        <input
          ref={passwordRef}
          id="password"
          type="password"
          placeholder="&#xf06e; Password"
          autoComplete="new-password"
          required
        />
      </div>
      <div id={inputStyles["submitBox"]}>
        <input type="submit" value={submitButtonText}></input>
      </div>
    </form>
  );
};

export default AuthForm;
