if (!import.meta.env.VITE_BASE_API_URL) {
  throw new Error("BASE_API_URL is not defined");
}

if (!import.meta.env.VITE_EMAIL_VALIDATION_REGEX) {
  throw new Error("EMAIL_VALIDATION_REGEX is not defined");
}

export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_BASE_API_URL,
  EMAIL_VALIDATION_REGEX: import.meta.env.VITE_EMAIL_VALIDATION_REGEX,
  PASSWORD_MIN_LENGTH: 6
} as const;

export const VALIDATION_RULES = {
  EMAIL: APP_CONFIG.EMAIL_VALIDATION_REGEX,
  PASSWORD: {
    MIN_LENGTH: APP_CONFIG.PASSWORD_MIN_LENGTH,
    REQUIRE_UPPERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true
  }
} as const;
