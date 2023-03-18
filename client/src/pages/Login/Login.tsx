import { PureComponent } from "react";
import { LoginTitle, LoginNavLink } from "./components";
import { AuthForm } from "../../components";
import Constants from "../../utils/Constants";

interface IRequest {
  email: string;
  password: string;
}

class Login extends PureComponent {
  private readonly submitButtonText: string;
  private readonly title: JSX.Element;
  private readonly navigateLink: JSX.Element;

  constructor(props: any) {
    super(props);
    this.submitButtonText = Constants.SignInButtonText;
    this.title = LoginTitle();
    this.navigateLink = LoginNavLink();
  }

  handleLoginSubmit = (reqObject: IRequest) => {
    console.log("Now send the request: ", reqObject);
  };

  render() {
    console.log("Mpika Login");
    return (
      <AuthForm>
        <AuthForm.Header titleSlot={this.title} />
        <AuthForm.Main
          onFormSubmit={this.handleLoginSubmit}
          submitButtonText={this.submitButtonText}
        />
        <AuthForm.Footer navLinkSlot={this.navigateLink} />
      </AuthForm>
    );
  }
}

export default Login;
