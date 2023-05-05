import { PureComponent } from "react";
import { ActionFunctionArgs, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
import { addAuthorizationHeader } from "../../../../config";
import { AuthForm, LoginTitle, LoginNavLink } from "../../components";
import { loginUser } from "../../api";
import { Constants } from "../../constants";
import { QueryClient } from "@tanstack/react-query";
import { userDetailsQuery } from "../../../Profile/api";

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

function action(queryClient: QueryClient) {
  return async function ({ request }: ActionFunctionArgs) {
    try {
      const response = await request.formData();
      const email = response.get("email") as string;
      const password = response.get("password") as string;
      console.log("Mpoika me email: ", email);

      const access_token = await loginUser({
        email: email,
        password: password,
      });

      queryClient.clear();
      addAuthorizationHeader(access_token);

      return redirect(`http://localhost:5173/profile`);
    } catch (error: unknown) {
      toast.error(error as string);
      return redirect("");
    }
  };
}
