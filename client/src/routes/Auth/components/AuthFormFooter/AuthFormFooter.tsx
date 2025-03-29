import {
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  TwitterIcon,
} from "../../../../icons";
import { facebookInitLoginFlow } from "../../api";
import { Constants } from "../../constants";
import footerStyles from "./AuthFormFooter.module.scss";

function AuthFormFooter(props: IProps): JSX.Element {
  const { navLinkSlot } = props;

  const responseFacebook = async () => {
    facebookInitLoginFlow();
  };

  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles["social-profile-paragraph"]}>
        <p>{Constants.SocialProfilesFormText}</p>
      </div>
      <ul id={footerStyles["social-profiles"]}>
        <li className={footerStyles["social-item"]}>
          <GoogleIcon />
        </li>
        <li className={footerStyles["social-item"]} onClick={responseFacebook}>
          <FacebookIcon />
        </li>
        <li className={footerStyles["social-item"]}>
          <GithubIcon />
        </li>
        <li className={footerStyles["social-item"]}>
          <TwitterIcon />
        </li>
      </ul>
      <div className={footerStyles["social-item"]}>{navLinkSlot}</div>
    </footer>
  );
}

export default AuthFormFooter;

interface IProps {
  navLinkSlot: JSX.Element;
}

type SocialItem = "facebook" | "google" | "twitter" | "github";
