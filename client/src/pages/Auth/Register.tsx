import { Fragment, PureComponent } from "react";
import AuthForm from "../../components/AuthForm/Form";
import RegisterTitle from "../../components/AuthForm/RegisterFormItems/RegisterTitle";
import RegisterNavigate from "../../components/AuthForm/RegisterFormItems/RegisterNavigateItem";
import Constants from "../../utils/Constants";
import FormHeader from "../../components/AuthForm/FormHeader";
import SocialProfileItems from "../../components/AuthForm/SocialProfileItems";
import Footer from "../../layouts/Footer/Footer";
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
      <Fragment>
        <div id={styles["main-container"]}>
          <div className={styles["main-wrapper"]}>
            <FormHeader title={this.title} />
            <AuthForm
              onFormSubmit={this.handleRegisterSubmit}
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

export default Register;
