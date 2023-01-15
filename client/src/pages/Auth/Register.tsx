import { PureComponent } from "react";
import AuthForm from "../../components/AuthForm/Form";
import RegisterTitle from "../../components/AuthForm/RegisterFormItems/RegisterTitle";
import RegisterNavigate from "../../components/AuthForm/RegisterFormItems/RegisterNavigateItem";
import Constants from "../../utils/Constants";

interface IRequest {
  email: string;
  password: string;
}

class Register extends PureComponent {
  private readonly submitButtonString: string;
  private readonly title: JSX.Element;
  private readonly navigateParagraph: JSX.Element;

  constructor(props: {}) {
    super(props);
    this.submitButtonString = Constants.RegisterButtonText;
    this.title = RegisterTitle();
    this.navigateParagraph = RegisterNavigate();
  }

  handleRegisterSubmit = (reqObject: IRequest) => {
    console.log("Now send the request: ", reqObject);
  };

  render() {
    return (
      <AuthForm
        onFormSubmit={this.handleRegisterSubmit}
        title={this.title}
        navigateParagraph={this.navigateParagraph}
        submitButton={this.submitButtonString}
      />
    );
  }
}

export default Register;
