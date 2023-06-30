import React, { ClipboardEvent, ForwardedRef, forwardRef } from "react";
import { useAtom } from "jotai";
import "font-awesome/css/font-awesome.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { Constants } from "../../utils/Modules/Constants";
import { Theme } from "../../utils";
import { themeAtom } from "../../store";
import { useHidePassword } from "../../hooks";
import { inputStyles } from "../../styles";

const PasswordInput = forwardRef<HTMLInputElement, IProps>(
  (props, ref?: TRef) => {
    const [theme, _] = useAtom<Theme>(themeAtom);
    const [hidePassword, togglePasswordVisibility] = useHidePassword();
    const {
      attributes,
      rightIconStyles,
      leftIconSlot,
      preventCopyPasteEnabled,
      label,
    } = props;

    function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
      event.preventDefault();
      event.currentTarget.removeAttribute("readOnly");
    }

    function preventCopyPaste(event: ClipboardEvent<HTMLInputElement>) {
      if (preventCopyPasteEnabled === true) {
        event.preventDefault();
      }
    }

    const rightIconSlot = (
      <FontAwesomeIcon
        icon={hidePassword === true ? faEye : faEyeSlash}
        className={rightIconStyles}
        onClick={togglePasswordVisibility}
      />
    );

    const labelSlot: JSX.Element | null =
      label !== undefined ? <label>{label}</label> : null;
    const type: string = hidePassword === true ? "password" : "text";

    return (
      <>
        {leftIconSlot}
        {labelSlot}
        <input
          className={`${inputStyles.input} ${
            theme === Constants.LightPalette ? inputStyles.lightBorder : ""
          }`}
          ref={ref}
          {...attributes}
          onFocus={handleFocus}
          type={type}
          onCopy={preventCopyPaste}
          onPaste={preventCopyPaste}
          onCut={preventCopyPaste}
        />
        {rightIconSlot}
      </>
    );
  }
);

export default PasswordInput;

interface IProps {
  attributes: React.InputHTMLAttributes<HTMLInputElement>;
  rightIconStyles: string;
  leftIconSlot: JSX.Element;
  preventCopyPasteEnabled?: boolean;
  label?: string;
}

type TRef = ForwardedRef<HTMLInputElement>;
