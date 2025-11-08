import type { User } from "./models.types";

type AuthUserRequiredFields = Pick<User, "id" | "name" | "email">;
type AuthUserOptionalFields = Partial<
  Pick<User, "avatarUrl" | "country" | "currency">
>;

export type AuthUser = AuthUserRequiredFields & AuthUserOptionalFields;

export interface AuthLoginResponse {
  user: AuthUser;
}

export interface AuthRegisterResponse {
  user: AuthUser;
}

export interface AuthCurrentUserResponse {
  user: AuthUser;
}

// DTOs (Data Transfer Objects) for API requests
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
