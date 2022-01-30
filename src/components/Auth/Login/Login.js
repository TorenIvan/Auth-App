import { PureComponent } from "react";
import AuthForm from "../AuthForm";
import LoginHeader from "./LoginHeader";
import LoginFooter from "./LoginFooter";

class Login extends PureComponent {
  constructor(props){
    super(props);
    this.header = LoginHeader();
    this.footer = LoginFooter();
  }

  handleLoginSubmit = reqObject => {
    console.log("Now send the request: ", reqObject);
  }

  render() {
    return <AuthForm onSubmit={this.handleLoginSubmit} header={this.header} footer={this.footer}/>
  }
}

export default Login;
