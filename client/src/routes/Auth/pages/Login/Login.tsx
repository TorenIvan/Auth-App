import { PureComponent } from "react";
import { ActionFunctionArgs, Navigate, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
import { globalQueryClient } from "../../../../App";
import { AuthForm, LoginTitle, LoginNavLink } from "../../components";
import { loginUser } from "../../api";
import { Constants } from "../../constants";

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
    const response = await request.formData();
    const email = response.get("email") as string;
    const password = response.get("password") as string;

    const access_token = await loginUser({
      email: email,
      password: password,
    });

    globalQueryClient.setQueryData(["access_token"], {
      access_token: access_token,
    });

    return redirect("../profile");
  } catch (error: unknown) {
    toast.error(error as string);
    return redirect("");
  }
}
