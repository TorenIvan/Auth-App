import React, { ClipboardEvent, ForwardedRef, forwardRef } from "react";
import { useAtom } from "jotai";
import "font-awesome/css/font-awesome.min.css";
import { inputStyles } from "../../styles";
import { Theme } from "../../utils";
import { themeAtom } from "../../store";
import { Constants } from "../../utils/Modules/Constants";

const Input = forwardRef<HTMLInputElement, IProps>(
  (props, ref?: TRef): JSX.Element => {
    const [theme, _] = useAtom<Theme>(themeAtom);
    const { attributes, preventCopyPasteEnabled, leftIconSlot, label } = props;

    function preventCopyPaste(event: ClipboardEvent<HTMLInputElement>) {
      if (preventCopyPasteEnabled === true) {
        event.preventDefault();
      }
    }

    const labelSlot: JSX.Element | null =
      label !== undefined ? <label>{label}</label> : null;

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
          onCopy={preventCopyPaste}
          onPaste={preventCopyPaste}
          onCut={preventCopyPaste}
        />
      </>
    );
  }
);

export default Input;

interface IProps {
  attributes: React.InputHTMLAttributes<HTMLInputElement>;
  preventCopyPasteEnabled?: boolean;
  leftIconSlot?: JSX.Element;
  label?: string;
}

type TRef = ForwardedRef<HTMLInputElement>;
