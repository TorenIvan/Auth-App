import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Errors } from "../../errors";
import { Constants } from "../../constants";
import { useFacebookLogin } from "../../hooks";
import { addAuthorizationHeader } from "../../../../config";
import styles from "./styles.module.scss";

export function LoginFacebook() {
  const navigate = useNavigate();

  // Extract params from URL
  const { search } = window.location;
  const urlParams = new URLSearchParams(search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  // Validate params
  let isParamsValid = true;
  if (!search || !code || !state) {
    toast.error(Errors.InvalidQueryParameters);
    localStorage.removeItem("auth_app_csrf_token");
    isParamsValid = false;
  }

  // Validate CSRF
  if (isParamsValid) {
    const csrfToken = extractCSRFToken(state);
    if (csrfToken !== localStorage.getItem("auth_app_csrf_token")) {
      toast.error(Errors.InvalidCSRFToken);
      localStorage.removeItem("auth_app_csrf_token");
      isParamsValid = false;
    }
  }

  // Always clear token from storage after check
  useEffect(() => {
    localStorage.removeItem("auth_app_csrf_token");
  }, []);

  const { data, error } = useFacebookLogin({
    code: isParamsValid ? code! : "",
  });

  function goBackToLogin() {
    navigate("/login");
  }

  useEffect(() => {
    if (data) {
      addAuthorizationHeader(data);
      navigate("/profile");
    }

    if (error) {
      toast.error(typeof error === "string" ? error : Errors.GenericError);
      if (error === Errors.AUserAlreadyAuthenticated) {
        navigate("/profile");
      }
    }
  }, [data, error, navigate]);

  if (!isParamsValid || error) {
    return (
      <div id={styles.container}>
        <h2 id={styles.header}>{Constants.LoginHeaderError}</h2>
        <FontAwesomeIcon
          icon={faCircleXmark}
          className={styles.fontIconError}
          beatFade
        />
        <p id={styles.content}>
          <em>{Constants.LoginParagraphError}</em>
        </p>
        <button id={styles.button} onClick={goBackToLogin}>
          <span>{Constants.BackToSignIn}</span>
        </button>
      </div>
    );
  }

  return (
    <div id={styles.container}>
      <h2 id={styles.header}>{Constants.LoginHeaderLoading}</h2>
      <FontAwesomeIcon icon={faSpinner} className={styles.fontIcon} spinPulse />
      <p id={styles.content}>
        <em>{Constants.ConfirmParagraphLoading}</em>
      </p>
    </div>
  );
}

function extractCSRFToken(inputString: string | null): string | undefined {
  if (!inputString) return undefined;
  
  const start = "csrf_token=";
  const end = "}";
  const startIndex = inputString.indexOf(start);

  if (startIndex !== -1) {
    const endIndex = inputString.indexOf(end, startIndex);
    if (endIndex !== -1) {
      return inputString.substring(startIndex + start.length, endIndex);
    }
  }
  return undefined;
}