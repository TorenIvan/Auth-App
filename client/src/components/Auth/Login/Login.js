import { PureComponent } from "react";
import AuthForm from "../Form/AuthForm";
import LoginTitle from "./LoginTitle";
import LoginNavigate from "./LoginNavigate";

class Login extends PureComponent {
  constructor(props){
    super(props);
    this.submitButtonString = "Sign In";
    this.title = LoginTitle();
    this.navigateParagraph = LoginNavigate();
  }

  handleLoginSubmit = reqObject => {
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
