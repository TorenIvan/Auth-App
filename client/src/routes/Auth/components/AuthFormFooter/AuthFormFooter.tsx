import { FacebookIcon, GithubIcon, GoogleIcon, TwitterIcon } from '../../../../icons';
import { facebookInitLoginFlow, githubInitLoginFlow } from '../../api';
import { Constants } from '../../constants';
import footerStyles from './AuthFormFooter.module.scss';

function AuthFormFooter(props: IProps): JSX.Element {
  const { navLinkSlot, isSubmitting } = props;

  const responseFacebook = async () => {
    if (isSubmitting) return;
    facebookInitLoginFlow();
  };

  const responseGithub = async () => {
    if (isSubmitting) return;
    githubInitLoginFlow();
  };

  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles['social-profile-paragraph']}>
        <p>{Constants.SocialProfilesFormText}</p>
      </div>
      <ul id={footerStyles['social-profiles']}>
        <li className={footerStyles['social-item']} data-loading={isSubmitting ? 'true' : 'false'}>
          <GoogleIcon />
        </li>
        <li
          className={footerStyles['social-item']}
          data-loading={isSubmitting ? 'true' : 'false'}
          onClick={responseFacebook}
        >
          <FacebookIcon />
        </li>
        <li
          className={footerStyles['social-item']}
          data-loading={isSubmitting ? 'true' : 'false'}
          onClick={responseGithub}
        >
          <GithubIcon />
        </li>
        <li className={footerStyles['social-item']} data-loading={isSubmitting ? 'true' : 'false'}>
          <TwitterIcon />
        </li>
      </ul>
      <div className={footerStyles['social-item']}>{navLinkSlot}</div>
    </footer>
  );
}

export default AuthFormFooter;

interface IProps {
  navLinkSlot: JSX.Element;
  isSubmitting: boolean;
}

// type SocialItem = "facebook" | "google" | "twitter" | "github";
