import { useEffect } from "react";
import { useAuth } from "./store";
import { RouterProvider } from "react-router-dom";
import indexRouter from "./routes/main.router";
import { setupAxiosInterceptors } from "./config/axios";

export function AppWithAxiosSetup(): JSX.Element {
  const { refreshTokens, logout, login } = useAuth();
  
  // Setup axios interceptors with AuthContext methods
  useEffect(() => {
    setupAxiosInterceptors({ refreshTokens, logout });
  }, [refreshTokens, logout]);

  return (
    <div className="screen-container">
      <RouterProvider router={indexRouter(login)} />
    </div>
  );
}
