import React, { ClipboardEvent, ForwardedRef, forwardRef } from "react";
import "font-awesome/css/font-awesome.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useHidePassword } from "../../hooks";
import { inputStyles } from "../../styles";

const PasswordInput = forwardRef<HTMLInputElement, IProps>(
  (props, ref?: TRef) => {
    const [hidePassword, togglePasswordVisibility] = useHidePassword();
    const { attributes, iconStyles, preventCopyPasteEnabled, label } = props;

    function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
      event.preventDefault();
      event.currentTarget.removeAttribute("readOnly");
    }

    function preventCopyPaste(event: ClipboardEvent<HTMLInputElement>) {
      if (preventCopyPasteEnabled === true) {
        event.preventDefault();
      }
    }

    const iconSlot = (
      <FontAwesomeIcon
        icon={hidePassword === true ? faEye : faEyeSlash}
        className={iconStyles}
        onClick={togglePasswordVisibility}
      />
    );
    const labelSlot: JSX.Element | null =
      label !== undefined ? <label>{label}</label> : null;
    const type: string = hidePassword === true ? "password" : "text";

    return (
      <>
        {labelSlot}
        <input
          className={inputStyles.input}
          ref={ref}
          {...attributes}
          onFocus={handleFocus}
          type={type}
          onCopy={preventCopyPaste}
          onPaste={preventCopyPaste}
          onCut={preventCopyPaste}
        />
        {iconSlot}
      </>
    );
  }
);

export default PasswordInput;

interface IProps {
  attributes: React.InputHTMLAttributes<HTMLInputElement>;
  iconStyles: string;
  preventCopyPasteEnabled?: boolean;
  label?: string;
}

type TRef = ForwardedRef<HTMLInputElement>;
