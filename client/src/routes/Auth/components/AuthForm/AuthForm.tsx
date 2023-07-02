import { Fragment } from "react";
import { Form } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import {
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  TwitterIcon,
} from "../../../../icons";
import { InputGroup } from "../../../../components";
import { inputStyles } from "../../../../styles";
import { Constants } from "../../constants";
import { headerStyles, mainStyles, footerStyles, styles } from "./styles";

function AuthForm(props: IProps) {
  const { titleSlot, submitButtonText, navLinkSlot, forgotPasswordSlot } =
    props;

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
        >
          <div className={mainStyles["auth-item"]}>
            <InputGroup stylesContainer="auth-form">
              <Fragment>
                <InputGroup.LeftIcon
                  icon={faEnvelope}
                  styles={inputStyles["fa-lock-form"]}
                />
                <InputGroup.Input
                  attributes={{
                    id: "email",
                    type: "text",
                    name: "email",
                    placeholder: Constants.Email,
                    autoComplete: "off",
                    required: true,
                  }}
                />
              </Fragment>
            </InputGroup>
          </div>
          <div className={mainStyles["auth-item"]}>
            <InputGroup stylesContainer="auth-form">
              {({ hidePassword, togglePasswordVisibility }) => (
                <Fragment>
                  <InputGroup.LeftIcon
                    icon={faLock}
                    styles={inputStyles["fa-lock-form"]}
                  />
                  <InputGroup.Input
                    attributes={{
                      id: "password",
                      name: "password",
                      autoComplete: "new-password",
                      placeholder: "Password",
                      readOnly: true,
                      required: true,
                      type: hidePassword === true ? "password" : "text",
                    }}
                    readonlyFocusEnabled
                    preventCopyPasteEnabled
                  />
                  <InputGroup.RightIcon
                    icon={hidePassword === true ? faEye : faEyeSlash}
                    styles={inputStyles["fa-eye-middle"]}
                    handleClick={togglePasswordVisibility}
                  />
                </Fragment>
              )}
            </InputGroup>
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
