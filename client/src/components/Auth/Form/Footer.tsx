import {
  FacebookIcon,
  TwitterIcon,
  GithubIcon,
  GoogleIcon,
} from "../../../assets/index";
import { memo } from "react";
import "font-awesome/css/font-awesome.min.css";
import styles from "../authStyles.module.css";
import footerStyles from "../authFooter.module.css";

interface IProps {
  navigateParagraph: JSX.Element;
}

const Footer = ({ navigateParagraph }: IProps): JSX.Element => {
  return (
    <footer className={footerStyles.footer}>
      <div className={styles["social-profile-paragraph"]}>
        <p>or continue with these social profiles</p>
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
      <div className={styles["social-item"]}>{navigateParagraph}</div>
    </footer>
  );
};

export default memo(Footer);
