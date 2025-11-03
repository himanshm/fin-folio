export class BaseError extends Error {
  public httpStatus: number;
  constructor(message: string, httpStatus: number = 500) {
    super(message); // Call the constructor of the Error base class with the error message
    this.name = this.constructor.name; // Set the name of the error to the name of the derived class
    Error.captureStackTrace(this, this.constructor); // Exclude this constructor from the stack trace
    this.httpStatus = httpStatus; // Set the HTTP status code for the error
  }
}

export class ValidationError extends BaseError {
  // For User Input Validation and Data Validation
  additionalData?: Record<string, unknown>;
  constructor(message: string) {
    super(message || "Invalid Data", 400);
  }
}

export class ConfigurationError extends BaseError {
  // For missing/invalid app configuration (env vars, secrets, etc.)
  constructor(message: string) {
    super(message || "Application configuration error", 500);
  }
}

export class ResourceNotFoundError extends BaseError {
  // For when requested resource doesn't exist (user, post, etc.)
  constructor(resource: string) {
    super(resource || "Resource not Found", 404);
  }
}

export class RouteNotFoundError extends BaseError {
  // For invalid API endpoints
  constructor() {
    super("API route not found", 404);
  }
}

export class DatabaseError extends BaseError {
  // For database connection/query failures
  constructor(message: string) {
    super(message || "Database Error", 500);
  }
}

export class AuthenticationError extends BaseError {
  // For invalid/missing authentication tokens
  constructor(message?: string) {
    super(message || "Invalid Authentication", 401);
  }
}

export class ForbiddenError extends BaseError {
  // For valid auth but insufficient permissions
  constructor(message: string) {
    super(message || "Reqeusted action forbidden for user.", 403);
  }
}
