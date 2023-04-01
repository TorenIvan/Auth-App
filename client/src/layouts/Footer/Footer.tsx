import { Fragment, memo } from "react";
import Toast from "../../components/Toast";
import { GlobalConstants } from "../../utils";
import styles from "./footerStyles.module.css";

const Footer = () => {
  return (
    <Fragment>
      <div className={styles["developer-information"]}>
        <span>
          {GlobalConstants.CreatedBy}{" "}
          <span id={styles["developer-name"]}>
            <a
              href={GlobalConstants.DeveloperGitHubProfile}
              target="_blank"
              rel="noreferrer noopener"
            >
              {GlobalConstants.DeveloperName}
            </a>
          </span>
        </span>
        <span>{GlobalConstants.ChallengeSite}</span>
      </div>
      <Toast />
    </Fragment>
  );
};

export default memo(Footer);
