import type { AuthFormConfig, AuthFormMode } from "@/types";

export const AUTH_FORM_CONFIGS: Record<AuthFormMode, AuthFormConfig> = {
  login: {
    title: "Login",
    description: "Enter your email and password to login",
    fields: ["email", "password"],
    submitText: "Login",
    submitLoadingText: "Logging In...",
    footerLink: {
      text: "Don't have an account?",
      linkText: "Sign Up",
      to: "/register"
    },
    forgotPassword: true
  },
  register: {
    title: "Register",
    description: "Create your account",
    fields: ["name", "email", "password", "confirmPassword"],
    submitText: "Sign Up",
    submitLoadingText: "Signing Up...",
    footerLink: {
      text: "Already have an account?",
      linkText: "Login",
      to: "/login"
    }
  },
  "forgot-password": {
    title: "Forgot Password",
    description: "Enter your email to reset your password",
    fields: ["email"],
    submitText: "Send Reset Link",
    submitLoadingText: "Sending Reset Link...",
    footerLink: {
      text: "Remember your password?",
      linkText: "Back to Login",
      to: "/login"
    }
  },
  "reset-password": {
    title: "Reset Password",
    description: "Enter your new password",
    fields: ["password", "confirmPassword"],
    submitText: "Reset Password",
    submitLoadingText: "Resetting Password..."
  },
  "change-password": {
    title: "Change Password",
    description: "Enter your current and new password",
    fields: ["currentPassword", "newPassword", "confirmPassword"],
    submitText: "Change Password",
    submitLoadingText: "Changing Password..."
  }
} as const;
