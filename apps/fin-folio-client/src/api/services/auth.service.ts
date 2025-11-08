import { AUTH_ENDPOINTS } from "@/api/api.routes";
import api from "@/api/base";
import type {
  AuthCurrentUserResponse,
  AuthLoginResponse,
  AuthRegisterResponse,
  LoginDto,
  RegisterDto
} from "@/types";

export const authService = {
  login: async (credentials: LoginDto) => {
    const response = await api.post<AuthLoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    return response;
  },

  logout: async () => {
    await api.post(AUTH_ENDPOINTS.LOGOUT);
  },

  register: async (credentials: RegisterDto) => {
    const response = await api.post<AuthRegisterResponse>(
      AUTH_ENDPOINTS.REGISTER,
      credentials
    );
    return response;
  },

  getCurrentUser: async () => {
    const response = await api.get<AuthCurrentUserResponse>(
      AUTH_ENDPOINTS.CURRENT_USER
    );
    return response;
  },

  refreshToken: async () => {
    // Cookie-based refresh; no token is sent or consumed client-side
    await api.post(AUTH_ENDPOINTS.REFRESH);
  }
};
