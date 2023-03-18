import { memo, ReactNode } from "react";
import styles from "./mainStyles.module.scss";

const Main = ({children}: {children: ReactNode}) => {
  return (
    <main className={styles["main-container"]}>
      {children}
    </main>
  );
};

export default memo(Main);

