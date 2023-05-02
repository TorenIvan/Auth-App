import { PureComponent } from "react";
import { ActionFunctionArgs, redirect } from "react-router-dom";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AuthForm, RegisterTitle, RegisterNavLink } from "../../components";
import { Constants } from "../../constants";
import { registerUser } from "../../api/registerUser";

interface IRequest {
  email: string;
  password: string;
}

class Register extends PureComponent {
  private readonly submitButtonText: string;
  private readonly title: JSX.Element;
  private readonly navigateLink: JSX.Element;

  constructor(props: object) {
    super(props);
    this.submitButtonText = Constants.RegisterButtonText;
    this.title = RegisterTitle();
    this.navigateLink = RegisterNavLink();
  }

  handleRegisterSubmit = (reqObject: IRequest) => {
    console.log("Now send the request: ", reqObject);
  };

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

export { Register as default, action };

function action(queryClient: QueryClient) {
  return async function ({ request }: ActionFunctionArgs) {
    try {
      const response = await request.formData();
      const email = response.get("email") as string;
      const password = response.get("password") as string;

      const access_token = await registerUser({
        email: email,
        password: password,
      });

      queryClient.setQueryData(["access_token"], {
        access_token: access_token,
      });

      return redirect("../profile");
    } catch (error: unknown) {
      toast.error(error as string);
      return redirect("");
    }
  };
}
