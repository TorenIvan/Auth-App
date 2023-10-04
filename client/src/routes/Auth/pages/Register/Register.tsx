import { Fragment, PureComponent } from "react";
import { ActionFunctionArgs, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
import { isEmailValid, isPasswordValid } from "../../../../helpers";
import { Constants } from "../../constants";
import { registerUser } from "../../api";
import { Errors } from "../../errors";
import {
  RegisterTitle,
  RegisterNavLink,
  AuthFormGroup,
} from "../../components";

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
      <AuthFormGroup>
        <Fragment>
          <AuthFormGroup.Header titleSlot={this.title} />
          <AuthFormGroup.Form submitButtonText={this.submitButtonText} />
          <AuthFormGroup.Footer navLinkSlot={this.navigateLink} />
        </Fragment>
      </AuthFormGroup>
    );
  }
}

export { Register as default, action };

async function action({ request }: ActionFunctionArgs) {
  try {
    const response = await request.formData();
    const email = response.get("email") as string;
    const password = response.get("password") as string;

    if (isEmailValid(email) === false) {
      toast.error(Errors.InvalidEmail);
      return false;
    }
    if (isPasswordValid(password) === false) {
      toast.error(Errors.InvalidPassword);
      return false;
    }

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
