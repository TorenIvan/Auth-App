import { FC, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../authStyles.module.css";
import inputStyles from "../authInput.module.css";
import Constants from "../../../utils/Constants";

interface IProps {
  onFormSubmit: (arg: any) => void;
  title: JSX.Element;
  navigateParagraph: JSX.Element;
  submitButton: string;
}

const AuthForm: FC<IProps> = (props): JSX.Element => {
  const { onFormSubmit, title, navigateParagraph, submitButton } = props;
  const [formValue, setFormValue] = useState({ email: "", password: "" });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value } = event.target;
    setFormValue((prevState) => ({ ...prevState, [type]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //validate common (Login/Register) things
    onFormSubmit(JSON.stringify(formValue));
  };

  const { email, password } = formValue;
  return (
    <div className={styles["screen-container"]}>
      <div id={styles["main-container"]}>
        <div className={styles["main-wrapper"]}>
          <Header title={title} />
          <form className={styles["auth-container"]} onSubmit={handleSubmit}>
            <div className={inputStyles["auth-item"]}>
              <input
                id="email"
                type="email"
                placeholder="&#xf0e0; Email"
                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"
                required
                onChange={handleChange}
                value={email}
              />
            </div>
            <div className={inputStyles["auth-item"]}>
              <input
                id="password"
                type="password"
                placeholder="&#xf06e; Password"
                autoComplete="new-password"
                required
                onChange={handleChange}
                value={password}
              />
            </div>
            <div id={inputStyles["submitBox"]}>
              <input type="submit" value={submitButton}></input>
            </div>
          </form>
          <Footer navigateParagraph={navigateParagraph} />
        </div>
      </div>
      <div className={styles["developer-information"]}>
        <span>
          {Constants.CreatedBy}{" "}
          <span id={styles["developer-name"]}>{Constants.DeveloperName}</span>
        </span>
        <span>{Constants.ChallengeSite}</span>
      </div>
    </div>
  );
};

export default AuthForm;
