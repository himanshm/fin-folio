import type { AuthFormFieldConfig } from "@/types";
import { VALIDATION_RULES } from "./config";

export const AUTH_FORM_FIELD_CONFIGS: Record<string, AuthFormFieldConfig> = {
  name: {
    label: "Name",
    type: "text",
    autoComplete: "name",
    validation: {
      required: "Name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters long"
      }
    }
  },
  email: {
    label: "Email",
    type: "email",
    autoComplete: "email",
    validation: {
      required: "Email is required",
      pattern: {
        value: VALIDATION_RULES.EMAIL,
        message: "Invalid email address"
      }
    }
  },
  password: {
    label: "Password",
    type: "password",
    autoComplete: "current-password",
    validation: {
      required: "Password is required",
      minLength: {
        value: VALIDATION_RULES.PASSWORD.MIN_LENGTH,
        message: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long`
      }
    }
  },
  confirmPassword: {
    label: "Confirm Password",
    type: "password",
    autoComplete: "new-password",
    validation: {
      required: "Please confirm your password",
      validate: (value: string, formValues: Record<string, unknown>) =>
        value === formValues.password || "Passwords do not match"
    }
  },
  currentPassword: {
    label: "Current Password",
    type: "password",
    autoComplete: "current-password",
    validation: {
      required: "Current password is required"
    }
  },
  newPassword: {
    label: "New Password",
    type: "password",
    autoComplete: "new-password",
    validation: {
      required: "New password is required",
      minLength: {
        value: VALIDATION_RULES.PASSWORD.MIN_LENGTH,
        message: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long`
      }
    }
  }
} as const;
