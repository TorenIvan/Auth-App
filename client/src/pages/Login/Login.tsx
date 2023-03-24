import { PureComponent } from "react";
import { LoginTitle, LoginNavLink } from "./components";
import { AuthForm } from "../../components";
import Constants from "../../utils/Constants";
import { loginUser } from "./api";
// import type { IRequest, IResponse } from "./api";
import { toast } from "react-hot-toast";
import { ActionFunctionArgs, redirect } from "react-router-dom";

class Login extends PureComponent {
  private readonly submitButtonText: string;
  private readonly title: JSX.Element;
  private readonly navigateLink: JSX.Element;

  constructor(props: object) {
    super(props);
    this.submitButtonText = Constants.SignInButtonText;
    this.title = LoginTitle();
    this.navigateLink = LoginNavLink();
  }

  // handleLoginSubmit = (reqObject: IRequest) => {
  //   console.log("Now send the request: ", reqObject);
  // };

  render() {
    return (
      <AuthForm>
        <AuthForm.Header titleSlot={this.title} />
        <AuthForm.Main submitButtonText={this.submitButtonText} />
        <AuthForm.Footer navLinkSlot={this.navigateLink} />
      </AuthForm>
    );
  }
}

export async function action({ request }: ActionFunctionArgs): Promise<any> {
  try {
    const response = await request.formData();
    const email = response.get("email") as string;
    const password = response.get("password") as string;

    const access_token = await loginUser({
      email: email,
      password: password,
    });

    console.log({ access_token });
    return redirect("/profile");
  } catch (error: unknown) {
    toast.error(error as string);
  }
}

export default Login;
