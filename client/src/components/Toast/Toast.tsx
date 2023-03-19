import { toast, ToastBar, Toaster } from "react-hot-toast";
import styles from "./styles.module.scss";

export default function Toast() {
  return (
    <Toaster
      reverseOrder={false}
      position="bottom-right"
      toastOptions={{
        className: styles.toast,
        success: {
          duration: 3000,
        },
        error: {
          duration: Infinity,
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {isDismissable(t.type) === true && (
                <button
                  className={styles["toast-button"]}
                  onClick={() => toast.dismiss(t.id)}
                >
                  x
                </button>
              )}
            </>
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
