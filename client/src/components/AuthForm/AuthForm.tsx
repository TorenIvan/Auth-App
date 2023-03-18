import { ReactNode } from "react";
import AuthFormFooter from "./AuthFormFooter";
import AuthFormHeader from "./AuthFormHeader";
import AuthFormMain from "./AuthFormMain";
import styles from "./styles.module.scss";

function AuthForm({ children }: { children: ReactNode }) {
  return (
    <div id={styles["main-container"]}>
      <div className={styles["main-wrapper"]}>{children}</div>
    </div>
  );
}

AuthForm.Header = AuthFormHeader;
AuthForm.Footer = AuthFormFooter;
AuthForm.Main = AuthFormMain;

export default AuthForm;
