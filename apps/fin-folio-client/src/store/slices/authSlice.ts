import { authService } from "@/api/services/auth.service";
import type { ApiError, AuthUser, LoginDto, RegisterDto } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../withTypes";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  initialized: boolean;
  initializing: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  initialized: false,
  initializing: false,
  loading: false,
  error: null
};

// ===== THUNKS =====
export const login = createAppAsyncThunk<
  { user: AuthUser; message: string; success: boolean },
  LoginDto,
  { rejectValue: ApiError }
>("auth/login", async (credentials: LoginDto, { rejectWithValue }) => {
  try {
    const res = await authService.login(credentials);
    return {
      user: res.data.user,
      message: res.message,
      success: res.meta.success
    };
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const logout = createAppAsyncThunk<
  void,
  void,
  { rejectValue: ApiError }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const register = createAppAsyncThunk<
  { user: AuthUser; message: string; success: boolean },
  RegisterDto,
  { rejectValue: ApiError }
>("auth/register", async (data: RegisterDto, { rejectWithValue }) => {
  try {
    const res = await authService.register(data);
    return {
      user: res.data.user,
      message: res.message,
      success: res.meta.success
    };
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const getCurrentUser = createAppAsyncThunk<
  { user: AuthUser; message: string; success: boolean },
  void,
  { rejectValue: ApiError }
>("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getCurrentUser();
    return {
      user: res.data.user,
      message: res.message,
      success: res.meta.success
    };
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const initializeAuth = createAppAsyncThunk<
  void,
  void,
  { rejectValue: ApiError }
>("auth/initializeAuth", async (_, { dispatch, getState }) => {
  const state = getState() as { auth: AuthState };

  // Don't initialize if already initialized
  if (state.auth.initialized) {
    return;
  }
  try {
    await dispatch(getCurrentUser());
    // The getCurrentUser thunk will handle setting the auth state
    // We just need to ensure initialization is marked as complete
    return;
  } catch (error) {
    // Even if it fails, we mark as initialized to prevent retries
    return;
  }
});

/***** SLICE *****/

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: state => {
      state.initialized = false;
      state.initializing = false;
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },

    clearError: state => {
      state.error = null;
    }
  },
  extraReducers: builder => {
    // login
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialized = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload?.message || "Sign In failed";
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
      });
    // Register
    builder
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialized = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload?.message || "Register failed";
        state.isAuthenticated = false;
        state.initialized = true;
        state.loading = false;
      });
    // Sign Out
    builder
      .addCase(logout.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload?.message || "Sign Out failed";
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
        state.user = null;
      });
    // Get Current User
    builder
      .addCase(getCurrentUser.pending, state => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        if (action.payload.success && action.payload.user) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      .addCase(getCurrentUser.rejected, state => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
      });
    // Initialize Auth
    builder
      .addCase(initializeAuth.pending, state => {
        state.initializing = true;
      })
      .addCase(initializeAuth.fulfilled, state => {
        state.initializing = false;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, state => {
        state.initializing = false;
        state.initialized = true;
      });
  }
});

export const { clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
