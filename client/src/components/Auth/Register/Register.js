import { PureComponent } from "react";
import AuthForm from "../Form/AuthForm";
import RegisterTitle from "./RegisterTitle";
import RegisterNavigate from "./RegisterNavigate";

class Register extends PureComponent {
  constructor(props){
    super(props);
    this.submitButtonString = "Register Now!";
    this.title = RegisterTitle();
    this.navigateParagraph = RegisterNavigate();
  }
  
  handleRegisterSubmit = reqObject => {
    console.log("Now send the request: ", reqObject);
  }

  render() {
    console.log("Na do poses fores 8a kaneis render");
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
