import { memo } from "react";
import Constants from "../../utils/Constants";
import styles from "./footerStyles.module.css";

const Footer = () => {
  return (
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
  );
};

export default memo(Footer);
