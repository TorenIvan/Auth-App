import { FormEvent, Fragment } from "react";
import "font-awesome/css/font-awesome.min.css";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { InputGroup } from "../../../../components";
import { inputStyles } from "../../../../styles";
import { Constants } from "../../constants";
import mainStyles from "./AuthForm.module.scss";

function AuthForm(props: IProps): JSX.Element {
  const { submitButtonText, forgotPasswordSlot, onSubmit, isSubmitting } = props;

  return (
    <form
      autoComplete="off"
      className={mainStyles["auth-container"]}
      onSubmit={onSubmit}
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
        <input  
          data-loading={isSubmitting ? "true" : "false"}
          type="submit" 
          value={submitButtonText} 
          disabled={isSubmitting === true} 
        />
      </div>
      {forgotPasswordSlot}
    </form>
  );
}

export default AuthForm;

interface IProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  submitButtonText: string;
  forgotPasswordSlot?: JSX.Element;
  isSubmitting?: boolean;
}
