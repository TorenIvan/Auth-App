import { Fragment, PureComponent } from "react";
import { Footer } from "../../layouts";
import { LoginTitle, LoginNavigate } from "./components";
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

class Login extends PureComponent {
  private readonly submitButtonText: string;
  private readonly title: JSX.Element;
  private readonly navigateParagraph: JSX.Element;

  constructor(props: object) {
    super(props);
    this.submitButtonText = Constants.SignInButtonText;
    this.title = LoginTitle();
    this.navigateParagraph = LoginNavigate();
  }

  handleLoginSubmit = (reqObject: IRequest) => {
    console.log("Now send the request: ", reqObject);
  };

  render() {
    return (
      <Fragment>
        <div id={styles["main-container"]}>
          <div className={styles["main-wrapper"]}>
            <AuthFormHeader title={this.title} />
            <AuthForm
              onFormSubmit={this.handleLoginSubmit}
              submitButtonText={this.submitButtonText}
            />
            <AuthSocialProfileList navigateParagraph={this.navigateParagraph} />
          </div>
        </div>
        <Footer />
      </Fragment>
    );
  }
}

export default Login;
