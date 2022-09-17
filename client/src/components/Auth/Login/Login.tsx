import { PureComponent } from "react";
import AuthForm from "../Form/AuthForm";
import LoginTitle from "./LoginTitle";
import LoginNavigate from "./LoginNavigate";

interface IRequest {
  email: string;
  password: string;
}

class Login extends PureComponent {
  private readonly submitButtonString: string;
  private readonly title: JSX.Element;
  private readonly navigateParagraph: JSX.Element;

  constructor(props: {}){
    super(props);
    this.submitButtonString = "Sign In";
    this.title = LoginTitle();
    this.navigateParagraph = LoginNavigate();
  }

  handleLoginSubmit = (reqObject: IRequest) => {
    console.log("Now send the request: ", reqObject);
  }

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
