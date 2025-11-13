import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAuth,
  getCurrentUser,
  login,
  logout,
  register
} from "@/store/slices/authSlice";
import type { LoginDto, RegisterDto } from "@/types";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector(state => state.auth);

  const signIn = useCallback(
    async (credentials: LoginDto) => {
      const result = await dispatch(login(credentials));

      if (login.fulfilled.match(result)) {
        toast.success(result.payload.message);
        return { success: true, data: result.payload };
      }

      if (login.rejected.match(result)) {
        const error = result.payload?.message || "Sign in failed";
        toast.error(error);
        return { success: false, error };
      }
      return { success: false, error: "Unknown error occurred" };
    },
    [dispatch]
  );

  const signOut = useCallback(async () => {
    const result = await dispatch(logout());

    if (logout.fulfilled.match(result)) {
      toast.success("Signed out successfully");
      navigate("/login", { replace: true });
      return { success: true };
    }

    if (logout.rejected.match(result)) {
      const error = result.payload?.message || "Sign out failed";
      toast.error(error);
      return { success: false, error };
    }

    // Even if API fails, clear local state
    dispatch(clearAuth());
    navigate("/login", { replace: true });
    return { success: false };
  }, [dispatch, navigate]);

  const signUp = useCallback(
    async (credentials: RegisterDto) => {
      const result = await dispatch(register(credentials));

      if (register.fulfilled.match(result)) {
        toast.success(result.payload.message);
        return { success: result.payload.success, data: result.payload };
      }

      if (register.rejected.match(result)) {
        const error = result.payload?.message || "Registration failed";
        toast.error(error);
        return { success: false, error };
      }

      return { success: false, error: "Unknown error occurred" };
    },
    [dispatch]
  );

  const checkSession = useCallback(async () => {
    const result = await dispatch(getCurrentUser());

    if (getCurrentUser.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    }

    return { success: false, error: "No active session" };
  }, [dispatch]);

  return {
    // State
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.loading,
    error: auth.error,
    initialized: auth.initialized,

    // Actions
    signIn,
    signOut,
    signUp,
    checkSession
  };
};
