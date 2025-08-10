import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { checkIfUserIsAuthenticated, renewTokens } from "../../api";
import { logoutUser } from "../../routes/Profile/api";

interface AuthContextType {
  isAuthenticated: boolean | undefined; // undefined = loading
  login: () => Promise<void>;
  logout: () => Promise<void>;
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

  const login = useCallback(async () => {
    // After successful login API call
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser(); 
    } finally {
      setIsAuthenticated(false);
    }
  }, []);

  // This method will be called by axios interceptor
  const refreshTokensWithContext = useCallback(async (): Promise<string> => {
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

  // On mount, check auth 
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        logout, 
        refreshTokens: refreshTokensWithContext 
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