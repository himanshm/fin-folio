import { useAppSelector } from "@/store/hooks";
import { Outlet, useNavigate } from "react-router";

interface RouteGuardProps {
  requiredAuth: boolean; // true = protected, false = public
  redirectTo: string;
}

const RouteGuard = ({ requiredAuth, redirectTo }: RouteGuardProps) => {
  const { isAuthenticated, initialized } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  if (!initialized) {
    return null;
  }

  const shouldRedirect = requiredAuth ? !isAuthenticated : isAuthenticated;

  if (shouldRedirect) {
    navigate(redirectTo, { replace: true });
  }

  return <Outlet />;
};

export default RouteGuard;
