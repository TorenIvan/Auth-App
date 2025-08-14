import { ForwardedRef, forwardRef } from "react";
import styles from "./styles.module.scss";
import { Constants } from "../../utils/Constants";
import { useTheme } from "../../store";

export const Textarea = forwardRef<HTMLTextAreaElement, IProps>(
  (props, ref: TRef): JSX.Element => {
    const [theme] = useTheme();
    const { labelSlot, attributes, isLoading = false } = props;

    return (
      <section className={styles["textarea-container"]}>
        {labelSlot}
        {isLoading ? (
          <div className="textarea-skeleton" /> 
        ): (
          <textarea
            {...attributes}
            ref={ref}
            className={`${styles.textarea} ${
              theme === Constants.LightPalette ? styles.lightBorder : ""
            }`}
          />
        )}
      </section>
    );
  }
);

interface IProps {
  labelSlot?: JSX.Element;
  attributes: IAttributes;
  isLoading?: boolean;
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
