import { DiscordIcon, GithubIcon, GitlabIcon, GoogleIcon } from '../../../../icons';
import {
  discordInitLoginFlow,
  githubInitLoginFlow,
  gitlabInitLoginFlow,
  googleInitLoginFlow,
} from '../../api';
import { Constants } from '../../constants';
import footerStyles from './AuthFormFooter.module.scss';

function AuthFormFooter(props: IProps): JSX.Element {
  const { navLinkSlot, isSubmitting } = props;

  const responseGoogle = async () => {
    if (isSubmitting) return;
    googleInitLoginFlow();
  };

  // const responseMicrosoft = async () => {
  //   if (isSubmitting) return;
  //   microsoftInitLoginFlow();
  // };

  // const responseFacebook = async () => {
  //   if (isSubmitting) return;
  //   facebookInitLoginFlow();
  // };

  const responseGithub = async () => {
    if (isSubmitting) return;
    githubInitLoginFlow();
  };

  const responseGitlab = async () => {
    if (isSubmitting) return;
    gitlabInitLoginFlow();
  };

  // const responseTwitter = async () => {
  //   if (isSubmitting) return;
  //   twitterInitLoginFlow();
  // };

  // const responseLinkedin = async () => {
  //   if (isSubmitting) return;
  //   linkedinInitLoginFlow();
  // };

  const responseDiscord = async () => {
    if (isSubmitting) return;
    discordInitLoginFlow();
  };

  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles['social-profile-paragraph']}>
        <span>{Constants.SocialProfilesFormText}</span>
      </div>
      <ul id={footerStyles['social-profiles']}>
        <li
          key="0"
          className={footerStyles['list-item']}
          data-loading={isSubmitting ? 'true' : 'false'}
          onClick={responseGoogle}
          title="Google"
        >
          <GoogleIcon />
        </li>
        {/* <li
          key="1"
          className={footerStyles['list-item']}
          data-loading={isSubmitting ? 'true' : 'false'}
          onClick={responseMicrosoft}
          title="Microsoft"
        >
          <MicrosoftIcon />
        </li>
        <li
          key="2"
          className={footerStyles['list-item']}
          data-loading={isSubmitting ? 'true' : 'false'}
          onClick={responseFacebook}
          title="Facebook"
        >
          <FacebookIcon />
        </li> */}
        {/* <li
          key="6"
          className={footerStyles['list-item']}
          data-loading={isSubmitting ? 'true' : 'false'}
          onClick={responseLinkedin}
          title="LinkedIn"
        >
          <LinkedInIcon />
        </li> */}
        <li
          key="3"
          className={footerStyles['list-item']}
          data-loading={isSubmitting ? 'true' : 'false'}
          onClick={responseGithub}
          title="Github"
        >
          <GithubIcon />
        </li>
        <li
          key="4"
          className={footerStyles['list-item']}
          data-loading={isSubmitting ? 'true' : 'false'}
          onClick={responseGitlab}
          title="Gitlab"
        >
          <GitlabIcon />
        </li>
        {/* <li
          key="5"
          className={footerStyles['list-item']}
          data-loading={isSubmitting ? 'true' : 'false'}
          onClick={responseTwitter}
          title="Twitter"
        >
          <TwitterIcon />
        </li> */}
        <li
          key="7"
          className={footerStyles['list-item']}
          data-loading={isSubmitting ? 'true' : 'false'}
          onClick={responseDiscord}
          title="Discord"
        >
          <DiscordIcon />
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
