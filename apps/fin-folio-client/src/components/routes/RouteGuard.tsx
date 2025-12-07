import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

interface RouteGuardProps {
  requiredAuth: boolean; // true = protected, false = public
  redirectTo: string;
}

const RouteGuard = ({ requiredAuth, redirectTo }: RouteGuardProps) => {
  const { isAuthenticated, initialized } = useAuth();

  // Allow rendering if:
  // 1. Auth is fully initialized, OR
  // 2. User is authenticated (from cached user) even if still initializing
  // This prevents blank page flash when cachedUser exists but initialization is pending
  if (!initialized && !isAuthenticated) {
    return null;
  }

  const shouldRedirect = requiredAuth ? !isAuthenticated : isAuthenticated;

  if (shouldRedirect) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RouteGuard;
