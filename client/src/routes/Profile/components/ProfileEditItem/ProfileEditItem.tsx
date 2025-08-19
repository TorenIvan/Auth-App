import styles from './styles.module.scss';

export function ProfileEditItem({ children }: IProps): JSX.Element {
  return <section className={styles['edit-item-container']}>{children}</section>;
}

interface IProps {
  children: JSX.Element;
}
