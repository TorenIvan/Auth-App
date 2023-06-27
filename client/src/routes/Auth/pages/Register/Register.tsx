import { PureComponent } from "react";
import { ActionFunctionArgs, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthForm, RegisterTitle, RegisterNavLink } from "../../components";
import { Constants } from "../../constants";
import { registerUser } from "../../api/registerUser";

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

export { Register as default, action };

async function action({ request }: ActionFunctionArgs) {
  try {
    const response = await request.formData();
    const email = response.get("email") as string;
    const password = response.get("password") as string;

    await registerUser({
      email: email,
      password: password,
    });

    toast.success(Constants.ConfirmEmailMessage);
    return redirect("../login");
  } catch (error: unknown) {
    toast.error(error as string);
    return true;
  }
}
