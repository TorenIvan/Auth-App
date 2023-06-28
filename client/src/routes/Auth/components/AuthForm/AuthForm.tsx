import { useRef } from "react";
import { Form } from "react-router-dom";
import { toast } from "react-hot-toast";
import "font-awesome/css/font-awesome.min.css";
import {
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  TwitterIcon,
} from "../../../../icons";
import { Input, PasswordInput } from "../../../../components";
import { inputStyles } from "../../../../styles";
import { Constants } from "../../constants";
import { Errors } from "../../errors";
import { validateEmail, validatePassword } from "../../helpers";
import { headerStyles, mainStyles, footerStyles, styles } from "./styles";

function AuthForm(props: IProps) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { titleSlot, submitButtonText, navLinkSlot, forgotPasswordSlot } =
    props;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (validateEmail(emailRef.current?.value ?? "") === false) {
      toast.error(Errors.InvalidEmail);
      event.preventDefault();
      return;
    }
    if (validatePassword(passwordRef.current?.value ?? "") === false) {
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
          autoComplete="off"
          method="post"
          action=""
          className={mainStyles["auth-container"]}
          onSubmit={handleSubmit}
        >
          <div className={mainStyles["auth-item"]}>
            <Input
              ref={emailRef}
              attributes={{
                id: "email",
                type: "text",
                name: "email",
                placeholder:
                  String.fromCharCode(parseInt("f0e0", 16)) + " Email",
                required: true,
              }}
            />
          </div>
          <div className={mainStyles["auth-item"]}>
            <PasswordInput
              ref={passwordRef}
              attributes={{
                id: "password",
                name: "password",
                autoComplete: "new-password",
                placeholder:
                  String.fromCharCode(parseInt("f06e", 16)) + " Password",
                readOnly: true,
                required: true,
              }}
              iconStyles={inputStyles["fa-eye"]}
            />
          </div>
          <div id={mainStyles["submitBox"]}>
            <input type="submit" value={submitButtonText}></input>
          </div>
          {forgotPasswordSlot}
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
  forgotPasswordSlot?: JSX.Element;
}
