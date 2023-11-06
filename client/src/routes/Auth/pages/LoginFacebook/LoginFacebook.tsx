import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Errors } from "../../errors";
import { Constants } from "../../constants";
import { useFacebookLogin } from "../../hooks";
import { useEffect } from "react";
import { addAuthorizationHeader } from "../../../../config";
import styles from "./styles.module.scss"

export function LoginFacebook() {
  const code = useLoaderData();
  const navigate = useNavigate();
  const { data, error, isLoading } = useFacebookLogin({ code: code as string | boolean });

  function goBackToLogin() {
    return navigate("../../login");
  }

  useEffect(() => {
    if (data) {
      addAuthorizationHeader(data);
      navigate("../../profile");
    }

    if (error) {
      toast.error(typeof error === "string" ? error : Errors.GenericError);
      if (error === Errors.AUserAlreadyAuthenticated) {
        navigate("../../profile");
      }
    }
  }, [data, error, isLoading])


  if (code === false || error) {
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

export async function loader() {
  try {
    const { search } = window.location;
    if (!search) {
      setTimeout(() => {
        toast.error(Errors.InvalidQueryParameters);
      }, 500);
      localStorage.removeItem("auth_app_csrf_token");
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }

    const urlParams = new URLSearchParams(search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (!code || !state) {
      setTimeout(() => {
        toast.error(Errors.InvalidQueryParameters);
      }, 500);
      localStorage.removeItem("auth_app_csrf_token");
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }
    const csrf_token = extractCSRFToken(state);
    if (csrf_token !== localStorage.getItem("auth_app_csrf_token")) {
      setTimeout(() => {
        toast.error(Errors.InvalidCSRFToken);
      }, 500);
      localStorage.removeItem("auth_app_csrf_token");
      return redirect(`${import.meta.env.VITE_CLIENT_URI}login`);
    }
    localStorage.removeItem("auth_app_csrf_token");
    return code;
  } catch (error: string | unknown) {
    setTimeout(() => {
      toast.error(typeof error === "string" ? error : Errors.GenericError);
    }, 500);
    localStorage.removeItem("auth_app_csrf_token");
    return false;
  }
}

function extractCSRFToken(inputString: string): string | undefined {
  const start = "csrf_token=";
  const end = "}";
  const startIndex = inputString.indexOf(start);

  if (startIndex !== -1) {
    const endIndex = inputString.indexOf(end, startIndex);
    if (endIndex !== -1) {
      const csrfToken = inputString.substring(startIndex + start.length, endIndex);
      return csrfToken;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

