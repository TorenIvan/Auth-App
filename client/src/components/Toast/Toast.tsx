import { Fragment } from "react";
import { toast, ToastBar, Toaster } from "react-hot-toast";
import styles from "./styles.module.scss";

export default function Toast() {
  return (
    <Toaster
      reverseOrder={false}
      position="bottom-right"
      toastOptions={{
        success: {
          duration: 10000,
        },
        error: {
          duration: 18000,
          style: {
            maxWidth: 500,
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <Fragment>
              <div className={styles["toast-icon"]}>{icon}</div>
              <div className={styles["toast-message"]}>{message}</div>
              {isDismissable(t.type) === true && (
                <button
                  className={styles["toast-button"]}
                  onClick={() => toast.dismiss(t.id)}
                >
                  <span className={styles["button-label"]}>Dismiss</span>
                  <span className={styles["button-icon"]}>&times;</span>
                </button>
              )}
            </Fragment>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

function isDismissable(type: string): boolean {
  if (type === "loading") {
    return false;
  }
  if (type === "success") {
    return false;
  }
  return true;
}
