import { memo } from "react";
import styles from "./styles.module.scss";

function ProfileDetail({ label, valueSlot }: IProps): JSX.Element {
  return (
    <section className={styles["details-row"]}>
      <div className={styles["details-label-column"]}>
        <span>{label}</span>
      </div>
      <div className={styles["details-value-column"]}>{valueSlot}</div>
    </section>
  );
}

export default memo(ProfileDetail);

interface IProps {
  label: string;
  valueSlot: JSX.Element;
}
