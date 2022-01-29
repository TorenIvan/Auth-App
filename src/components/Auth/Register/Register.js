import { PureComponent } from "react";
import AuthForm from "../AuthForm";

class Register extends PureComponent {

  handleRegisterSubmit = reqObject => {
    console.log("Now send the request: ", reqObject);
  }

  render() {
    return <AuthForm type={"Register"} onSubmit={this.handleRegisterSubmit}/>
  }
}

export default Register;
