import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { setupAxiosInterceptors } from "./config";
import { useRenewTokensMutation } from "./hooks";
import { useLogoutMutation } from "./routes/Auth/hooks";
import indexRouter from "./routes";

export function AppWithAxiosSetup(): JSX.Element {
  const { renewTokens } = useRenewTokensMutation()
  const { logout } = useLogoutMutation();
  
  // Setup axios interceptors with react query methods
  useEffect(() => {
    setupAxiosInterceptors({ refreshTokens: renewTokens, logout });
  }, [renewTokens, logout]);

  return (
    <div className="screen-container">
      <RouterProvider router={indexRouter()} />
    </div>
  );
}
