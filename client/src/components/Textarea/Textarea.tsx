import { ForwardedRef, forwardRef } from "react";
import styles from "./styles.module.scss";

export const Textarea = forwardRef<HTMLTextAreaElement, IProps>(
  (props, ref: TRef): JSX.Element => {
    const { labelSlot, attributes } = props;

    return (
      <section className={styles["textarea-container"]}>
        {labelSlot}
        <textarea {...attributes} ref={ref} />
      </section>
    );
  }
);

interface IProps {
  labelSlot?: JSX.Element;
  attributes: IAttributes;
}

interface IAttributes {
  placeholder: string;
  label?: string;
  defaultValue?: string;
  id?: string;
  type?: string;
  name?: string;
}

type TRef = ForwardedRef<HTMLTextAreaElement>;
