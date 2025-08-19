import Assets from '../../../../assets';
import { GlobalConstants } from '../../../../utils';
import { useTheme } from '../../../../store';
import styles from './styles.module.scss';

function UserAvatar({ userImage, isLoading }: IProps): JSX.Element {
  const [theme] = useTheme();

  if (isLoading) {
    return <div className={`avatar-skeleton small`} />;
  }

  if (userImage === undefined) {
    return (
      <img
        src={Assets.GenericAvatar}
        alt="Avatar"
        className={`${styles.genericAvatar} ${
          theme === GlobalConstants.DarkPalette ? styles.invertWhite : ''
        }`}
      />
    );
  }
  return <img src={userImage} alt="ProfileImage" className={styles.genericAvatar} />;
}

export default UserAvatar;

interface IProps {
  userImage?: string;
  isLoading: boolean;
}
