/**
 * Error Handling - Custom error classes for Paperclip Agents App
 */

export enum ErrorCode {
  // General errors
  UNKNOWN = 'UNKNOWN_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INVALID_INPUT = 'INVALID_INPUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // File system errors
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  PARSE_ERROR = 'PARSE_ERROR',
  DETECTION_FAILED = 'DETECTION_FAILED',
  
  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  MIGRATION_FAILED = 'MIGRATION_FAILED',
  
  // org-os specific
  INVALID_FEDERATION = 'INVALID_FEDERATION',
  DISCOVERY_FAILED = 'DISCOVERY_FAILED',
  SKILL_INDEX_FAILED = 'SKILL_INDEX_FAILED',
  
  // Sync errors
  SYNC_FAILED = 'SYNC_FAILED',
  CONFLICT_DETECTED = 'CONFLICT_DETECTED'
}

export class PaperclipError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: Date;

  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'PaperclipError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PaperclipError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp.toISOString()
    };
  }
}

export class NotFoundError extends PaperclipError {
  constructor(resource: string, id?: string) {
    super(
      ErrorCode.NOT_FOUND,
      `${resource}${id ? ` with id ${id}` : ''} not found`,
      { resource, id }
    );
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends PaperclipError {
  constructor(message = 'Authentication required') {
    super(ErrorCode.UNAUTHORIZED, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends PaperclipError {
  constructor(message = 'Access denied') {
    super(ErrorCode.FORBIDDEN, message);
    this.name = 'ForbiddenError';
  }
}

export class ValidationError extends PaperclipError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(ErrorCode.INVALID_INPUT, message, details);
    this.name = 'ValidationError';
  }
}

export function isPaperclipError(error: unknown): error is PaperclipError {
  return error instanceof PaperclipError;
}

export function formatError(error: unknown): Record<string, unknown> {
  if (isPaperclipError(error)) {
    return error.toJSON();
  }

  return {
    name: 'Error',
    code: ErrorCode.UNKNOWN,
    message: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString()
  };
}
