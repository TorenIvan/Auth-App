import { CSSProperties, memo } from "react";
import styles from "./styles.module.scss";

function ProfileDetail({ label, valueSlot, isImage }: IProps): JSX.Element {
  const valueColumnStyles: string = setValueColumnStyles(isImage);

  return (
    <section className={styles["details-row"]}>
      <div className={styles["details-label-column"]}>
        <span>{label}</span>
      </div>
      <div className={styles[valueColumnStyles]}>{valueSlot}</div>
    </section>
  );
}

export default memo(ProfileDetail);

interface IProps {
  label: string;
  valueSlot: JSX.Element;
  isImage?: boolean;
}

function setValueColumnStyles(isImage?: boolean): string {
  let valueColumnStyles: string = "details-value-column";
  if (isImage === true) {
    valueColumnStyles = "details-value-column-image";
  }
  return valueColumnStyles;
}
