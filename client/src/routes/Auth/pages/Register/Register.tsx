import { PureComponent } from "react";
import { AuthForm, RegisterTitle, RegisterNavLink } from "../../components";
import { Constants } from "../../constants";

interface IRequest {
  email: string;
  password: string;
}

class Register extends PureComponent {
  private readonly submitButtonText: string;
  private readonly title: JSX.Element;
  private readonly navigateLink: JSX.Element;

  constructor(props: object) {
    super(props);
    this.submitButtonText = Constants.RegisterButtonText;
    this.title = RegisterTitle();
    this.navigateLink = RegisterNavLink();
  }

  handleRegisterSubmit = (reqObject: IRequest) => {
    console.log("Now send the request: ", reqObject);
  };

  render() {
    console.log("Mpika register");
    return (
      <AuthForm>
        <AuthForm.Header titleSlot={this.title} />
        <AuthForm.Main submitButtonText={this.submitButtonText} />
        <AuthForm.Footer navLinkSlot={this.navigateLink} />
      </AuthForm>
    );
  }
}

export default Register;
