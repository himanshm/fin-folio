export const EMAIL_VALIDATION_REGEX =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const EMAIL_VALIDATION_MESSAGE =
  'Use an email with alphanumeric characters, dots, underscores, percent signs, plus signs, or hyphens before @, followed by a valid domain with at least 2 letters after the dot';

export const PASSWORD_VALIDATION_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

export const PASSWORD_VALIDATION_MESSAGE =
  'Password must contain at least 8 characters, including at least one letter and one number';
