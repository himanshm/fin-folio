import { Spinner } from "@/components/ui/spinner";
import router from "@/routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuth, initializeAuth } from "@/store/slices/authSlice";
import { Loader } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const { initialized, initializing } = useAppSelector(state => state.auth);
  const hasDispatched = useRef(false);

  // Listen for automatic logout events (from token refresh failures)
  // Single global logout listener
  useEffect(() => {
    const handleAutoLogout = () => {
      dispatch(clearAuth());
      toast.error("Session expired. Please log in again.");
      router.navigate("/login", { replace: true });
    };

    window.addEventListener("auth:logout", handleAutoLogout);

    return () => {
      window.removeEventListener("auth:logout", handleAutoLogout);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!initialized && !hasDispatched.current) {
      hasDispatched.current = true;
      dispatch(initializeAuth());
    }
  }, [dispatch, initialized]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Spinner LoaderIcon={Loader} className="size-8" />
          <p className="text-lg text-muted-foreground">
            {initializing ? "Initializing..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
