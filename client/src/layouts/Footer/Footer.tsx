import { Fragment, memo } from "react";
import { Toaster } from "react-hot-toast";
import Constants from "../../utils/Constants";
import styles from "./footerStyles.module.css";

const Footer = () => {
  return (
    <Fragment>
      <div className={styles["developer-information"]}>
        <span>
          {Constants.CreatedBy}{" "}
          <span id={styles["developer-name"]}>
            <a
              href={Constants.DeveloperGitHubProfile}
              target="_blank"
              rel="noreferrer noopener"
            >
              {Constants.DeveloperName}
            </a>
          </span>
        </span>
        <span>{Constants.ChallengeSite}</span>
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          success: {
            duration: 3000,
          },
          error: {
            duration: 10000,
          },
        }}
      />
    </Fragment>
  );
};

export default memo(Footer);
