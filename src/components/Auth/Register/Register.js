import { PureComponent } from "react";
import AuthForm from "../AuthForm";
import RegisterHeader from "./RegisterHeader";
import RegisterFooter from "./RegisterFooter";

class Register extends PureComponent {
  constructor(props){
    super(props);
    this.header = RegisterHeader();
    this.footer = RegisterFooter();
  }
  
  handleRegisterSubmit = reqObject => {
    console.log("Now send the request: ", reqObject);
  }

  render() {
    return <AuthForm onSubmit={this.handleRegisterSubmit} header={this.header} footer={this.footer}/>
  }
}

export default Register;
