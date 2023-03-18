import {
  FacebookIcon,
  TwitterIcon,
  GithubIcon,
  GoogleIcon,
} from "../../../icons";
import { memo } from "react";
import "font-awesome/css/font-awesome.min.css";
import styles from "./styles.module.css";
import Constants from "../../../utils/Constants";

interface IProps {
  navLinkSlot: JSX.Element;
}

const AuthFormFooter = ({ navLinkSlot }: IProps): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <div className={styles["social-profile-paragraph"]}>
        <p>{Constants.SocialProfilesFormText}</p>
      </div>
      <ul id={styles["social-profiles"]}>
        <li className={styles["social-item"]}>
          <GoogleIcon />
        </li>
        <li className={styles["social-item"]}>
          <FacebookIcon />
        </li>
        <li className={styles["social-item"]}>
          <GithubIcon />
        </li>
        <li className={styles["social-item"]}>
          <TwitterIcon />
        </li>
      </ul>
      <div className={styles["social-item"]}>{navLinkSlot}</div>
    </footer>
  );
};

export default memo(AuthFormFooter);
