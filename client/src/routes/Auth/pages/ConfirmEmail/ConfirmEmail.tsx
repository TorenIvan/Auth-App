import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faEnvelopeCircleCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Errors } from "../../errors";
import { Constants } from "../../constants";
import { confirmEmail } from "../../api";
import styles from "./styles.module.scss";

export function ConfirmEmail() {
  const isEmailConfirmed = useLoaderData();
  const navigate = useNavigate();

  function goBackToLogin() {
    return navigate("../login");
  }

  if (isEmailConfirmed === false) {
    return (
      <div id={styles.container}>
        <h2 id={styles.header}>{Constants.ConfirmHeaderError}</h2>
        <FontAwesomeIcon
          icon={faCircleXmark}
          className={styles.fontIconError}
          beatFade
        />
        <p id={styles.content}>
          <em>{Constants.ConfirmParagraphError}</em>
        </p>
        <button id={styles.button} onClick={goBackToLogin}>
          <span>{Constants.BackToSignIn}</span>
        </button>
      </div>
    );
  }

  if (isEmailConfirmed === true) {
    return (
      <div id={styles.container}>
        <h2 id={styles.header}>{Constants.ConfirmHeader}</h2>
        <FontAwesomeIcon
          icon={faEnvelopeCircleCheck}
          className={styles.fontIcon}
        />
        <p id={styles.content}>
          <em>{Constants.ConfirmParagraph}</em>
        </p>
        <button id={styles.button} onClick={goBackToLogin}>
          <span>{Constants.BackToSignIn}</span>
        </button>
      </div>
    );
  }

  return (
    <div id={styles.container}>
      <h2 id={styles.header}>{Constants.ConfirmHeaderLoading}</h2>
      <FontAwesomeIcon icon={faSpinner} className={styles.fontIcon} spinPulse />
      <p id={styles.content}>
        <em>{Constants.ConfirmParagraphLoading}</em>
      </p>
    </div>
  );
}

export async function loader() {
  try {
    const { search } = window.location;
    if (!search) {
      toast.error(Errors.NoConfirmationToken);
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }

    const urlParams = new URLSearchParams(search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    if (!token || !email) {
      toast.error(Errors.InvalidConfirmationToken);
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }

    await confirmEmail(email, token);
    return true;
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : (error as string));
    return false;
  }
}
