import styles from "./styles.module.scss";
import { inputStyles } from "../../../../styles";

export function ProfileInput(props: IProps): JSX.Element {
  const { label, attributes } = props;

  return (
    <section className={styles["input-container"]}>
      <label>{label}</label>
      <input className={inputStyles.input} {...attributes} />
    </section>
  );
}

interface IProps {
  label: string;
  attributes: IAttributes;
}

interface IAttributes {
  placeholder: string;
  value?: string;
}
