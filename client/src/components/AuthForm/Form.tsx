import { Fragment, useRef } from "react";
import FormHeader from "./FormHeader";
import SocialProfileItems from "./SocialProfileItems";
import styles from "./Styles/authStyles.module.css";
import inputStyles from "./Styles/authInput.module.css";
import Footer from "../../layouts/Footer/Footer";

interface IProps {
  onFormSubmit: (arg: any) => void;
  title: JSX.Element;
  navigateParagraph: JSX.Element;
  submitButton: string;
}

const AuthForm = (props: IProps): JSX.Element => {
  const { onFormSubmit, title, navigateParagraph, submitButton } = props;
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
    <Fragment>
      <div id={styles["main-container"]}>
        <div className={styles["main-wrapper"]}>
          <FormHeader title={title} />
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
              <input type="submit" value={submitButton}></input>
            </div>
          </form>
          <SocialProfileItems navigateParagraph={navigateParagraph} />
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default AuthForm;
