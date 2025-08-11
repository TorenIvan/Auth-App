import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { checkIfUserIsAuthenticated, renewTokens } from "../../api";
import { loginUser } from "../../routes/Auth/api";
import { logoutUser } from "../../routes/Profile/api";
import { addAuthorizationHeader } from "../../config";
import { QueryClient } from "@tanstack/react-query";

interface ILoginRequest {
  email: string; 
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean | undefined; // undefined = loading
  login: (req: ILoginRequest) => Promise<void>;
  logout: (queryClient: QueryClient) => Promise<void>;
  refreshTokens: () => Promise<string>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

  const checkAuth = useCallback(async () => {
    try {
      const authenticated = await checkIfUserIsAuthenticated();
      setIsAuthenticated(authenticated);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }: ILoginRequest): Promise<void> => {
    const accessToken = await loginUser({ email, password })
    addAuthorizationHeader(accessToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async (queryClient: QueryClient) => {
    try {
      await logoutUser(); 
    } finally {
      queryClient?.clear();
      addAuthorizationHeader("");
      setIsAuthenticated(false);
    }
  }, []);

  // This method will be called by axios interceptor
  const refreshTokens = useCallback(async (): Promise<string> => {
    try {
      const newToken = await renewTokens();
      // Token refresh successful, user is still authenticated
      setIsAuthenticated(true);
      return newToken;
    } catch (error) {
      // Token refresh failed, user is no longer authenticated
      setIsAuthenticated(false);
      throw error;
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        logout, 
        refreshTokens
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