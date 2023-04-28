import styles from "./styles.module.scss";

export function Textarea(props: IProps): JSX.Element {
  const { labelSlot, attributes } = props;
  const { placeholder, value } = attributes;

  return (
    <section className={styles["textarea-container"]}>
      {labelSlot}
      <textarea placeholder={placeholder} value={value} />
    </section>
  );
}

interface IProps {
  labelSlot?: JSX.Element;
  attributes: IAttributes;
}

interface IAttributes {
  placeholder: string;
  label?: string;
  value?: string;
  id?: string;
  type?: string;
  name?: string;
}
