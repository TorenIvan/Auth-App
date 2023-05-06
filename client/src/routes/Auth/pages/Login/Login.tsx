import { PureComponent } from "react";
import { ActionFunctionArgs, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";
import { addAuthorizationHeader } from "../../../../config";
import { AuthForm, LoginTitle, LoginNavLink } from "../../components";
import { loginUser } from "../../api";
import { Constants } from "../../constants";
import { checkIfUserIsAuthenticated } from "../../api";

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
      <AuthForm
        titleSlot={this.title}
        submitButtonText={this.submitButtonText}
        navLinkSlot={this.navigateLink}
      />
    );
  }
}

export { Login as default, action };

function loader(queryClient: QueryClient) {
  return async function () {
    try {
      await checkIfUserIsAuthenticated();
      return redirect("profile");
    } catch (error: unknown) {
      toast.error(error as string);
    }
  };
}

function action(queryClient: QueryClient) {
  return async function ({ request }: ActionFunctionArgs) {
    try {
      const response = await request.formData();
      const email = response.get("email") as string;
      const password = response.get("password") as string;

      const access_token = await loginUser({
        email: email,
        password: password,
      });

      addAuthorizationHeader(access_token);

      return redirect(`${import.meta.env.VITE_CLIENT_URI}profile`);
    } catch (error: unknown) {
      toast.error(error as string);
      return redirect("");
    }
  };
}
