import { PureComponent } from "react";
import AuthForm from "../AuthForm";

class Login extends PureComponent {

  handleLoginSubmit = reqObject => {
    console.log("Now send the request: ", reqObject);
  }

  render() {
    return <AuthForm type={"Login"} onSubmit={this.handleLoginSubmit}/>
  }
}

export default Login;
