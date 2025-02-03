// Error codes for client-side errors
export const ErrorCodes = {
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NOT_FOUND: 'NOT_FOUND',

  // Authentication errors
  AUTH_SIGN_IN_FAILED: 'AUTH_SIGN_IN_FAILED',
  AUTH_SIGN_UP_FAILED: 'AUTH_SIGN_UP_FAILED',
  AUTH_SIGN_OUT_FAILED: 'AUTH_SIGN_OUT_FAILED',
  AUTH_RESET_PASSWORD_FAILED: 'AUTH_RESET_PASSWORD_FAILED',
  AUTH_UPDATE_PASSWORD_FAILED: 'AUTH_UPDATE_PASSWORD_FAILED',
  AUTH_GET_USER_FAILED: 'AUTH_GET_USER_FAILED',
  AUTH_GET_SESSION_FAILED: 'AUTH_GET_SESSION_FAILED',

  // Job-related errors
  JOB_NOT_FOUND: 'JOB_NOT_FOUND',
  JOB_CREATE_FAILED: 'JOB_CREATE_FAILED',
  JOB_UPDATE_FAILED: 'JOB_UPDATE_FAILED',
  JOB_DELETE_FAILED: 'JOB_DELETE_FAILED',
  JOB_LIST_FAILED: 'JOB_LIST_FAILED',

  // Project-related errors
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  PROJECT_CREATE_FAILED: 'PROJECT_CREATE_FAILED',
  PROJECT_UPDATE_FAILED: 'PROJECT_UPDATE_FAILED',
  PROJECT_DELETE_FAILED: 'PROJECT_DELETE_FAILED',
  PROJECT_LIST_FAILED: 'PROJECT_LIST_FAILED',
} as const

export type ErrorCode = keyof typeof ErrorCodes

export interface ErrorResult {
  code: ErrorCode
  message: string
  devMessage?: string
}

export function handleClientError(error: unknown): ErrorResult {
  console.error('[ERROR_HANDLER]', error)

  // If it's already an ErrorResult, return it
  if (error && typeof error === 'object' && 'code' in error) {
    return error as ErrorResult
  }

  // Handle specific error cases
  if (error instanceof Error) {
    // Database errors
    if (error.message.includes('Database error')) {
      return {
        code: 'DATABASE_ERROR',
        message: getErrorMessage('DATABASE_ERROR'),
        devMessage: error.message
      }
    }

    // Not found errors
    if (error.message.includes('not found')) {
      return {
        code: 'NOT_FOUND',
        message: getErrorMessage('NOT_FOUND'),
        devMessage: error.message
      }
    }

    // Validation errors
    if (error.message.includes('validation')) {
      return {
        code: 'VALIDATION_ERROR',
        message: getErrorMessage('VALIDATION_ERROR'),
        devMessage: error.message
      }
    }

    // Unauthorized errors
    if (error.message.includes('unauthorized') || error.message.includes('not authenticated')) {
      return {
        code: 'UNAUTHORIZED',
        message: getErrorMessage('UNAUTHORIZED'),
        devMessage: error.message
      }
    }
  }

  // Default error
  return {
    code: 'UNKNOWN_ERROR',
    message: getErrorMessage('UNKNOWN_ERROR'),
    devMessage: error instanceof Error ? error.message : 'Unknown error occurred'
  }
}

export function getErrorMessage(code: ErrorCode): string {
  switch (code) {
    // General errors
    case 'UNKNOWN_ERROR':
      return 'An unexpected error occurred. Please try again.'
    case 'UNAUTHORIZED':
      return 'You are not authorized to perform this action.'
    case 'VALIDATION_ERROR':
      return 'Please check your input and try again.'
    case 'DATABASE_ERROR':
      return 'A database error occurred. Please try again.'
    case 'NOT_FOUND':
      return 'The requested resource was not found.'

    // Authentication errors
    case 'AUTH_SIGN_IN_FAILED':
      return 'Failed to sign in. Please check your credentials and try again.'
    case 'AUTH_SIGN_UP_FAILED':
      return 'Failed to create account. Please try again.'
    case 'AUTH_SIGN_OUT_FAILED':
      return 'Failed to sign out. Please try again.'
    case 'AUTH_RESET_PASSWORD_FAILED':
      return 'Failed to reset password. Please try again.'
    case 'AUTH_UPDATE_PASSWORD_FAILED':
      return 'Failed to update password. Please try again.'
    case 'AUTH_GET_USER_FAILED':
      return 'Failed to get user information. Please try again.'
    case 'AUTH_GET_SESSION_FAILED':
      return 'Failed to get session. Please try signing in again.'

    // Job-related errors
    case 'JOB_NOT_FOUND':
      return 'The specified job was not found.'
    case 'JOB_CREATE_FAILED':
      return 'Failed to create the job. Please try again.'
    case 'JOB_UPDATE_FAILED':
      return 'Failed to update the job. Please try again.'
    case 'JOB_DELETE_FAILED':
      return 'Failed to delete the job. Please try again.'
    case 'JOB_LIST_FAILED':
      return 'Failed to load jobs. Please try again.'

    // Project-related errors
    case 'PROJECT_NOT_FOUND':
      return 'The specified project was not found.'
    case 'PROJECT_CREATE_FAILED':
      return 'Failed to create the project. Please try again.'
    case 'PROJECT_UPDATE_FAILED':
      return 'Failed to update the project. Please try again.'
    case 'PROJECT_DELETE_FAILED':
      return 'Failed to delete the project. Please try again.'
    case 'PROJECT_LIST_FAILED':
      return 'Failed to load projects. Please try again.'

    default:
      return 'An unexpected error occurred. Please try again.'
  }
} 