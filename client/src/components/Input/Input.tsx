import React, { ClipboardEvent, ForwardedRef, forwardRef } from "react";
import "font-awesome/css/font-awesome.min.css";
import { inputStyles } from "../../styles";

const Input = forwardRef<HTMLInputElement, IProps>(
  (props, ref?: TRef): JSX.Element => {
    const { attributes, preventCopyPasteEnabled, label } = props;

    function preventCopyPaste(event: ClipboardEvent<HTMLInputElement>) {
      if (preventCopyPasteEnabled === true) {
        event.preventDefault();
      }
    }

    const labelSlot: JSX.Element | null =
      label !== undefined ? <label>{label}</label> : null;

    return (
      <>
        {labelSlot}
        <input
          className={inputStyles.input}
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
  label?: string;
}

type TRef = ForwardedRef<HTMLInputElement>;
