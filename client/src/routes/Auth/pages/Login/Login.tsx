import { Fragment, PureComponent } from "react";
import { ActionFunctionArgs, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
import { addAuthorizationHeader } from "../../../../config";
import { isEmailValid, isPasswordValid } from "../../../../helpers";
import { loginUser } from "../../api";
import { Constants } from "../../constants";
import { Errors } from "../../errors";
import {
  LoginTitle,
  LoginNavLink,
  ForgotPasswordLink,
  AuthFormGroup,
} from "../../components";

class Login extends PureComponent {
  private readonly submitButtonText: string;
  private readonly title: JSX.Element;
  private readonly navigateLink: JSX.Element;
  private readonly forgotPasswordLink: JSX.Element;

  constructor(props: object) {
    super(props);
    this.submitButtonText = Constants.SignInButtonText;
    this.title = LoginTitle();
    this.navigateLink = LoginNavLink();
    this.forgotPasswordLink = ForgotPasswordLink();
  }

  render() {
    return (
      <AuthFormGroup>
        <Fragment>
          <AuthFormGroup.Header titleSlot={this.title} />
          <AuthFormGroup.Form
            submitButtonText={this.submitButtonText}
            forgotPasswordSlot={this.forgotPasswordLink}
          />
          <AuthFormGroup.Footer navLinkSlot={this.navigateLink} />
        </Fragment>
      </AuthFormGroup>
    );
  }
}

export { Login as default, action };

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

    const access_token = await loginUser({
      email: email,
      password: password,
    });

    addAuthorizationHeader(access_token);

    return redirect(`${import.meta.env.VITE_CLIENT_URI}profile`);
  } catch (error: unknown) {
    toast.error(error as string);
    return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
  }
}
