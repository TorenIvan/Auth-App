import { useQuery } from "@tanstack/react-query";
import { checkIfUserIsAuthenticated } from "../../api";

export function useAuthStatus() {
  return useQuery(["authStatus"], isAuthenticated, {
    retry: false,
  });

  async function isAuthenticated() {
    try {
      const isAuthenticated = await checkIfUserIsAuthenticated();
      return isAuthenticated;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
