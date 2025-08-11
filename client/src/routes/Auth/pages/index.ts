import { Login, action as loginAction } from "./Login";
import { Component as Register, action as registerAction } from "./Register";
import { Component as ConfirmEmail, loader as confirmEmailLoader } from "./ConfirmEmail";
import { Component as ForgotPassword, action as forgotPasswordAction } from "./ForgotPassword";
import { Component as LoginFacebook, loader as loginFacebookLoader } from "./LoginFacebook";
import { Component as ResetPassword, loader as resetPasswordLoader, action as resetPasswordAction } from "./ResetPassword";

export {
  Login,
  loginAction,
  Register,
  registerAction,
  ConfirmEmail,
  confirmEmailLoader,
  ForgotPassword,
  forgotPasswordAction,
  ResetPassword,
  resetPasswordLoader,
  resetPasswordAction,
  LoginFacebook,
  loginFacebookLoader
};
