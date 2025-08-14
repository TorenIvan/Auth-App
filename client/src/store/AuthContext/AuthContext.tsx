import { ReactNode, createContext, useContext, useMemo } from "react";
import { useLoginMutation, useLogoutMutation } from "../../routes/Auth/hooks";
import { useCheckIfUserIsAuthenticatedQuery, useRenewTokensMutation } from "../../hooks";

interface ILoginRequest {
  email: string; 
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean | undefined;
  isLoadingAuth: boolean;
  login: (req: ILoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<string>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { logout } = useLogoutMutation();
  const { login, isLoggingIn } = useLoginMutation();
  const { renewTokens } = useRenewTokensMutation();
  const { isAuthenticated, isAuthenticating } = useCheckIfUserIsAuthenticatedQuery();

  const isLoadingAuth = useMemo(() => isAuthenticating || isLoggingIn, [isAuthenticating, isLoggingIn]);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        logout, 
        refreshTokens: renewTokens,
        isLoadingAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}