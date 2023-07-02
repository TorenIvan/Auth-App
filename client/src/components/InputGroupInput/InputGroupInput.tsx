import { ClipboardEvent, FocusEvent, InputHTMLAttributes } from "react";
import { useAtom } from "jotai";
import { Theme } from "../../utils";
import { Constants } from "../../utils/Modules/Constants";
import { themeAtom } from "../../store";
import { inputStyles } from "../../styles";

function InputGroupInput(props: IProps) {
  const [theme, _] = useAtom<Theme>(themeAtom);
  const { attributes, readonlyFocusEnabled, preventCopyPasteEnabled } = props;

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    if (readonlyFocusEnabled === true) {
      event.preventDefault();
      event.currentTarget.removeAttribute("readOnly");
    }
  }

  function preventCopyPaste(event: ClipboardEvent<HTMLInputElement>) {
    if (preventCopyPasteEnabled === true) {
      event.preventDefault();
    }
  }

  return (
    <input
      className={`${inputStyles.input} ${
        theme === Constants.LightPalette ? inputStyles.lightBorder : ""
      }`}
      {...attributes}
      onFocus={handleFocus}
      onCopy={preventCopyPaste}
      onPaste={preventCopyPaste}
      onCut={preventCopyPaste}
    />
  );
}

export default InputGroupInput;

interface IProps {
  attributes: InputHTMLAttributes<HTMLInputElement>;
  readonlyFocusEnabled?: boolean;
  preventCopyPasteEnabled?: boolean;
}
