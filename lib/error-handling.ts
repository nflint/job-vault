// Error codes for client-side errors
export const ErrorCodes = {
  AUTH_SIGN_IN: 'AUTH_SIGN_IN',
  AUTH_SIGN_UP: 'AUTH_SIGN_UP',
  AUTH_SIGN_OUT: 'AUTH_SIGN_OUT',
  AUTH_RESET_PASSWORD: 'AUTH_RESET_PASSWORD',
  AUTH_UPDATE_PASSWORD: 'AUTH_UPDATE_PASSWORD',
  AUTH_GET_USER: 'AUTH_GET_USER',
  AUTH_GET_SESSION: 'AUTH_GET_SESSION',
} as const

type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]

// Map of error messages by error code and specific error
const ERROR_MESSAGES: Record<ErrorCode, Record<string, string>> = {
  AUTH_SIGN_IN: {
    'Invalid login credentials': 'The email or password you entered is incorrect',
    'Invalid email or password': 'The email or password you entered is incorrect',
    'Email not confirmed': 'Please verify your email address before signing in',
    'Too many requests': 'Too many login attempts. Please try again in a few minutes',
    'Email link is invalid or has expired': 'Your login link has expired. Please request a new one',
  },
  AUTH_SIGN_UP: {
    'User already registered': 'An account with this email already exists',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long',
    'Unable to validate email address: invalid format': 'Please enter a valid email address',
    'Password is too weak': 'Please choose a stronger password',
    'Rate limit exceeded': 'Too many signup attempts. Please try again later',
  },
  AUTH_SIGN_OUT: {
    'Invalid session': 'Your session has expired. Please sign in again',
  },
  AUTH_RESET_PASSWORD: {
    'Email not found': 'No account found with this email address',
    'Rate limit exceeded': 'Too many reset attempts. Please try again later',
  },
  AUTH_UPDATE_PASSWORD: {
    'Password should be at least 6 characters': 'New password must be at least 6 characters long',
    'Password is too weak': 'Please choose a stronger password',
    'Rate limit exceeded': 'Too many attempts. Please try again later',
  },
  AUTH_GET_USER: {
    'Invalid JWT': 'Your session has expired. Please sign in again',
  },
  AUTH_GET_SESSION: {
    'Invalid JWT': 'Your session has expired. Please sign in again',
  },
}

export function handleClientError(error: unknown, code: ErrorCode): string {
  // Log the error for debugging
  console.error(`[${code}]`, error)

  // If it's our Error type with a message
  if (error instanceof Error) {
    // Check if we have a specific message for this error
    const errorMessages = ERROR_MESSAGES[code]
    const specificMessage = errorMessages[error.message]
    if (specificMessage) {
      return specificMessage
    }
    // If no specific message but we have an error message, use it
    return error.message
  }

  // For unknown errors, return a generic message
  return `An unexpected error occurred. Please try again.`
} 