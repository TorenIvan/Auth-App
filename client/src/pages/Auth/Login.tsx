import { Fragment, PureComponent } from "react";
import AuthForm from "../../components/AuthForm/Form";
import LoginTitle from "../../components/AuthForm/LoginFormItems/LoginTitle";
import LoginNavigate from "../../components/AuthForm/LoginFormItems/LoginNavigateItem";
import Constants from "../../utils/Constants";
import SocialProfileItems from "../../components/AuthForm/SocialProfileItems";
import FormHeader from "../../components/AuthForm/FormHeader";
import Footer from "../../layouts/Footer/Footer";
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
            <FormHeader title={this.title} />
            <AuthForm
              onFormSubmit={this.handleLoginSubmit}
              submitButtonText={this.submitButtonText}
            />
            <SocialProfileItems navigateParagraph={this.navigateParagraph} />
          </div>
        </div>
        <Footer />
      </Fragment>
    );
  }
}

export default Login;
