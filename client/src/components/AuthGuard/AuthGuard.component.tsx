import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../store";

const publicRoutes = ["/login", "/register", "/verify", "/forgot-password", "/reset-password"];

export function AuthGuard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated === undefined) return; // Still loading

    const isPublic = publicRoutes.some(route => 
      location.pathname.startsWith(route)
    );

    if (isAuthenticated && isPublic) {
      // Authenticated user on public route -> redirect to profile
      navigate("/profile", { replace: true });
    } else if (!isAuthenticated && !isPublic) {
      // Unauthenticated user on private route -> redirect to login
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Show loading while checking auth
  if (isAuthenticated === undefined) {
    return <div>Loading...</div>; // Or your loading component
  }

  return <Outlet />;
}