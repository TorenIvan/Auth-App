import { PureComponent } from "react";
import { ActionFunctionArgs, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LoginTitle, LoginNavLink } from "./components";
import { loginUser } from "./api";
import { AuthForm } from "../../components";
import Constants from "../../utils/Constants";

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

export { Login as default, action };

async function action({ request }: ActionFunctionArgs) {
  try {
    console.log("Mpika");

    const response = await request.formData();
    const email = response.get("email") as string;
    const password = response.get("password") as string;

    const access_token = await loginUser({
      email: email,
      password: password,
    });

    console.log({ access_token });
    return redirect("profile");
  } catch (error: unknown) {
    console.log("Mpika error? ti skata gnt?");

    toast.error(error as string);
  }
}
