import { Fragment } from "react";
import { ActionFunctionArgs, Form, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { InputGroup } from "../../../../components";
import { isEmailValid } from "../../../../helpers";
import { inputStyles } from "../../../../styles";
import { Errors } from "../../errors";
import { Constants } from "../../constants";
import { forgotPassword } from "../../api";
import styles from "./styles.module.scss";

function ForgotPassword() {
  return (
    <Form
      autoComplete="off"
      method="post"
      action=""
      className={styles["form-container"]}
    >
      <section id={styles.header}>
        <h2>{Constants.ForgotPassword}</h2>
        <p>{Constants.ForgotPasswordParagraph}</p>
      </section>
      <section id={styles.main}>
        <InputGroup>
          <Fragment>
            <InputGroup.LeftIcon
              icon={faEnvelope}
              styles={inputStyles["fa-lock-forgot"]}
            />
            <InputGroup.Input
              attributes={{
                id: "email",
                type: "text",
                name: "email",
                placeholder: Constants.EmailPlaceholder,
                autoComplete: "off",
                required: true,
              }}
              preventCopyPasteEnabled
            />
          </Fragment>
        </InputGroup>
        <div id={styles["submitBox"]}>
          <input type="submit" value={Constants.Continue}></input>
        </div>
      </section>
    </Form>
  );
}

export { ForgotPassword, action };

async function action({ request }: ActionFunctionArgs) {
  try {
    const response = await request.formData();
    const email = response.get("email") as string;

    if (isEmailValid(email) === false) {
      toast.error(Errors.InvalidEmail);
      return false;
    }

    const isOperationSuccessful: boolean = await forgotPassword(email.trim());
    if (isOperationSuccessful === false) {
      toast.error(Errors.GenericError);
      return false;
    }
    toast.success(Constants.ResetPasswordEmailMessage);
    return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : (error as string));
    return false;
  }
}
