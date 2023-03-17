import { PureComponent } from "react";
import { RegisterTitle, RegisterNavigate } from "./components";
import {
  AuthForm,
  AuthFormHeader,
  AuthSocialProfileList,
} from "../../components";
import Constants from "../../utils/Constants";
import styles from "./styles.module.scss";

interface IRequest {
  email: string;
  password: string;
}

class Register extends PureComponent {
  private readonly submitButtonText: string;
  private readonly title: JSX.Element;
  private readonly navigateParagraph: JSX.Element;

  constructor(props: object) {
    super(props);
    this.submitButtonText = Constants.RegisterButtonText;
    this.title = RegisterTitle();
    this.navigateParagraph = RegisterNavigate();
  }

  handleRegisterSubmit = (reqObject: IRequest) => {
    console.log("Now send the request: ", reqObject);
  };

  render() {
    return (
      <div id={styles["main-container"]}>
        <div className={styles["main-wrapper"]}>
          <AuthFormHeader title={this.title} />
          <AuthForm
            onFormSubmit={this.handleRegisterSubmit}
            submitButtonText={this.submitButtonText}
          />
          <AuthSocialProfileList navigateParagraph={this.navigateParagraph} />
        </div>
      </div>
    );
  }
}

export default Register;
