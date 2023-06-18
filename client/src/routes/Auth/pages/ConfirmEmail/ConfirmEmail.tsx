import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faEnvelopeCircleCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.scss";
import { Constants } from "../../constants";
import { checkIfUserIsAuthenticated } from "../../../../api";
import { toast } from "react-hot-toast";
import { confirmUserEmail } from "../../api/confirmEmail";
import { Errors } from "../../errors";

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
    const isAuthenticated = await checkIfUserIsAuthenticated();

    if (isAuthenticated === true) {
      return redirect(`${import.meta.env.VITE_CLIENT_URI}profile`);
    }

    const { search } = window.location;
    if (!search) {
      toast.error(Errors.NoConfirmationToken);
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }
    const queryStringTokenArray = search.split("token=");
    if (queryStringTokenArray.length !== 2) {
      toast.error(Errors.InvalidConfirmationToken);
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }
    const queryStringEmailArray = queryStringTokenArray[0].split("email=");
    if (queryStringEmailArray.length !== 2) {
      toast.error(Errors.InvalidConfirmationToken);
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }
    const token: string = queryStringTokenArray[1];
    const email: string = queryStringEmailArray[1].split("&")[0];

    await confirmUserEmail(email, token);
    return true;
  } catch (error: unknown) {
    toast.error(error as string);
    return false;
  }
}
