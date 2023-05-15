import { ForwardedRef, forwardRef } from "react";
import { Input, PasswordInput } from "../../../../components";
import { inputStyles } from "../../../../styles";
import styles from "./styles.module.scss";

export const ProfileInput = forwardRef<HTMLInputElement, IProps>(
  (props, ref?: TRef): JSX.Element => {
    const { isPassword, ...restProps } = props;

    const inputSlot =
      isPassword === true ? (
        <PasswordInput
          {...restProps}
          iconStyles={inputStyles["fa-eye-middle"]}
          ref={ref}
        />
      ) : (
        <Input {...restProps} ref={ref} />
      );

    return <section className={styles["input-container"]}>{inputSlot}</section>;
  }
);

interface IProps {
  label: string;
  attributes: IAttributes;
  isPassword?: boolean;
}

interface IAttributes {
  placeholder: string;
  autoComplete?: string;
  defaultValue?: string;
}

type TRef = ForwardedRef<HTMLInputElement>;
