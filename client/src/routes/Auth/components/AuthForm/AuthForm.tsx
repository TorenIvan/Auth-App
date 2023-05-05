import { useRef, useState } from "react";
import { Form } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "font-awesome/css/font-awesome.min.css";
import { Constants } from "../../constants";
import { Errors } from "../../errors";
import { emailValidator, passwordValidator } from "../../helpers";
import { inputStyles } from "../../../../styles";
import { headerStyles, mainStyles, footerStyles, styles } from "./styles";
import {
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  TwitterIcon,
} from "../../../../icons";

function AuthForm({ titleSlot, submitButtonText, navLinkSlot }: IProps) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [hidePassword, setHidePassword] = useState<boolean>(true);

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
    <div id={styles["main-container"]}>
      <div className={styles["main-wrapper"]}>
        <header className={headerStyles.header}>
          <div>{titleSlot}</div>
          <h4>{Constants.FormHeader}</h4>
        </header>
        <Form
          method="post"
          action=""
          className={mainStyles["auth-container"]}
          onSubmit={handleSubmit}
        >
          <div className={mainStyles["auth-item"]}>
            <input
              className={inputStyles.input}
              ref={emailRef}
              id="email"
              type="text"
              name="email"
              placeholder="&#xf0e0; Email"
              required
            />
          </div>
          <div className={mainStyles["auth-item"]}>
            <input
              className={inputStyles.input}
              ref={passwordRef}
              id="password"
              type={hidePassword === true ? "password" : "text"}
              name="password"
              placeholder="&#xf06e; Password"
              autoComplete="new-password"
              required
            />
            <FontAwesomeIcon
              icon={hidePassword === true ? faEye : faEyeSlash}
              className={inputStyles["fa-eye"]}
              onClick={() => setHidePassword((hidePassword) => !hidePassword)}
            />
          </div>
          <div id={mainStyles["submitBox"]}>
            <input type="submit" value={submitButtonText}></input>
          </div>
        </Form>
        <footer className={footerStyles.footer}>
          <div className={footerStyles["social-profile-paragraph"]}>
            <p>{Constants.SocialProfilesFormText}</p>
          </div>
          <ul id={footerStyles["social-profiles"]}>
            <li className={footerStyles["social-item"]}>
              <GoogleIcon />
            </li>
            <li className={footerStyles["social-item"]}>
              <FacebookIcon />
            </li>
            <li className={footerStyles["social-item"]}>
              <GithubIcon />
            </li>
            <li className={footerStyles["social-item"]}>
              <TwitterIcon />
            </li>
          </ul>
          <div className={footerStyles["social-item"]}>{navLinkSlot}</div>
        </footer>
      </div>
    </div>
  );
}

export default AuthForm;

interface IProps {
  titleSlot: JSX.Element;
  submitButtonText: string;
  navLinkSlot: JSX.Element;
}
