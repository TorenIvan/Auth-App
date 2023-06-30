import { ForwardedRef, forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Input, PasswordInput } from "../../../../components";
import { inputStyles } from "../../../../styles";
import styles from "./styles.module.scss";

export const ProfileInput = forwardRef<HTMLInputElement, IProps>(
  (props, ref?: TRef): JSX.Element => {
    const { isPassword, leftIconSlot, ...restProps } = props;

    const inputSlot =
      isPassword === true ? (
        <PasswordInput
          {...restProps}
          rightIconStyles={inputStyles["fa-eye-middle"]}
          ref={ref}
          preventCopyPasteEnabled
          leftIconSlot={
            <FontAwesomeIcon
              icon={faLock}
              className={inputStyles["fa-lock-middle"]}
            />
          }
        />
      ) : (
        <Input {...restProps} ref={ref} leftIconSlot={leftIconSlot} />
      );

    return <section className={styles["input-container"]}>{inputSlot}</section>;
  }
);

interface IProps {
  label: string;
  attributes: IAttributes;
  leftIconSlot?: JSX.Element;
  isPassword?: boolean;
}

interface IAttributes {
  placeholder: string;
  name?: string;
  autoComplete?: string;
  defaultValue?: string;
  disabled?: boolean;
}

type TRef = ForwardedRef<HTMLInputElement>;
