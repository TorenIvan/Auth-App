import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faEnvelopeCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.scss";
import { Constants } from "../../constants";

export function ConfirmEmail() {
  const navigate = useNavigate();

  function goBackToLogin() {
    return navigate("../login");
  }

  if (false) {
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
