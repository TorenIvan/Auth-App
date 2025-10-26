import styles from './styles.module.scss';

export function Loader() {
  return (
    <div className={styles['loader-container']}>
      <span className={styles.loader}></span>
    </div>
  );
}
