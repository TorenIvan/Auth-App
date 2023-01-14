import { PureComponent } from "react";
import AuthForm from "../../components/AuthForm/Form";
import LoginTitle from "../../components/AuthForm/LoginForm/LoginTitle";
import LoginNavigate from "../../components/AuthForm/LoginForm/LoginNavigateItem";
import Constants from "../../utils/Constants";

interface IRequest {
  email: string;
  password: string;
}

class Login extends PureComponent {
  private readonly submitButtonString: string;
  private readonly title: JSX.Element;
  private readonly navigateParagraph: JSX.Element;

  constructor(props: {}) {
    super(props);
    this.submitButtonString = Constants.SignInButtonText;
    this.title = LoginTitle();
    this.navigateParagraph = LoginNavigate();
  }

  handleLoginSubmit = (reqObject: IRequest) => {
    console.log("Now send the request: ", reqObject);
  };

  render() {
    return (
      <AuthForm
        onFormSubmit={this.handleLoginSubmit}
        title={this.title}
        navigateParagraph={this.navigateParagraph}
        submitButton={this.submitButtonString}
      />
    );
  }
}

export default Login;
