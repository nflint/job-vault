// Error codes for client-side errors
export const ErrorCodes = {
  AUTH_SIGN_IN: 'AUTH_SIGN_IN',
  AUTH_SIGN_UP: 'AUTH_SIGN_UP',
  AUTH_SIGN_OUT: 'AUTH_SIGN_OUT',
  AUTH_RESET_PASSWORD: 'AUTH_RESET_PASSWORD',
  AUTH_UPDATE_PASSWORD: 'AUTH_UPDATE_PASSWORD',
  AUTH_GET_USER: 'AUTH_GET_USER',
  AUTH_GET_SESSION: 'AUTH_GET_SESSION',
  
  // Job management
  JOB_CREATE: 'JOB_CREATE',
  JOB_UPDATE: 'JOB_UPDATE',
  JOB_DELETE: 'JOB_DELETE',
  JOB_LIST: 'JOB_LIST',
  
  // Resume management
  RESUME_CREATE: 'RESUME_CREATE',
  RESUME_UPDATE: 'RESUME_UPDATE',
  RESUME_DELETE: 'RESUME_DELETE',
  RESUME_EXPORT: 'RESUME_EXPORT',
  RESUME_SECTION_UPDATE: 'RESUME_SECTION_UPDATE',
  
  // Profile management
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  PROFILE_GET: 'PROFILE_GET',
  
  // Professional history
  HISTORY_CREATE: 'HISTORY_CREATE',
  HISTORY_UPDATE: 'HISTORY_UPDATE',
  HISTORY_DELETE: 'HISTORY_DELETE',
  
  // Education
  EDUCATION_CREATE: 'EDUCATION_CREATE',
  EDUCATION_UPDATE: 'EDUCATION_UPDATE',
  EDUCATION_DELETE: 'EDUCATION_DELETE',
  
  // Projects
  PROJECT_CREATE: 'PROJECT_CREATE',
  PROJECT_UPDATE: 'PROJECT_UPDATE',
  PROJECT_DELETE: 'PROJECT_DELETE',
  
  // Certifications
  CERT_CREATE: 'CERT_CREATE',
  CERT_UPDATE: 'CERT_UPDATE',
  CERT_DELETE: 'CERT_DELETE',
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
  
  // Job management messages
  JOB_CREATE: {
    'Invalid input': 'Please check the job details and try again',
    'Database error': 'Unable to save the job. Please try again',
    'Unauthorized': 'You must be signed in to create a job',
  },
  JOB_UPDATE: {
    'Job not found': 'The job you are trying to update does not exist',
    'Invalid input': 'Please check the job details and try again',
    'Unauthorized': 'You do not have permission to update this job',
  },
  JOB_DELETE: {
    'Job not found': 'The job you are trying to delete does not exist',
    'Unauthorized': 'You do not have permission to delete this job',
  },
  JOB_LIST: {
    'Unauthorized': 'You must be signed in to view jobs',
    'Database error': 'Unable to load jobs. Please try again',
  },

  // Resume management messages
  RESUME_CREATE: {
    'Invalid input': 'Please check the resume details and try again',
    'Database error': 'Unable to save the resume. Please try again',
    'Unauthorized': 'You must be signed in to create a resume',
  },
  RESUME_UPDATE: {
    'Resume not found': 'The resume you are trying to update does not exist',
    'Invalid input': 'Please check the resume details and try again',
    'Unauthorized': 'You do not have permission to update this resume',
  },
  RESUME_DELETE: {
    'Resume not found': 'The resume you are trying to delete does not exist',
    'Unauthorized': 'You do not have permission to delete this resume',
  },
  RESUME_EXPORT: {
    'Resume not found': 'The resume you are trying to export does not exist',
    'PDF generation failed': 'Unable to generate PDF. Please try again',
    'Unauthorized': 'You do not have permission to export this resume',
  },
  RESUME_SECTION_UPDATE: {
    'Section not found': 'The section you are trying to update does not exist',
    'Invalid input': 'Please check the section details and try again',
    'Unauthorized': 'You do not have permission to update this section',
  },

  // Profile management messages
  PROFILE_UPDATE: {
    'Invalid input': 'Please check your profile details and try again',
    'Database error': 'Unable to save your profile. Please try again',
    'Email already exists': 'This email is already associated with another account',
    'Unauthorized': 'You must be signed in to update your profile',
  },
  PROFILE_GET: {
    'Profile not found': 'Unable to load your profile. Please try again',
    'Unauthorized': 'You must be signed in to view your profile',
  },

  // Professional history messages
  HISTORY_CREATE: {
    'Invalid input': 'Please check the history details and try again',
    'Database error': 'Unable to save the history. Please try again',
    'Unauthorized': 'You must be signed in to create a history',
  },
  HISTORY_UPDATE: {
    'History not found': 'The history you are trying to update does not exist',
    'Invalid input': 'Please check the history details and try again',
    'Unauthorized': 'You do not have permission to update this history',
  },
  HISTORY_DELETE: {
    'History not found': 'The history you are trying to delete does not exist',
    'Unauthorized': 'You do not have permission to delete this history',
  },

  // Education messages
  EDUCATION_CREATE: {
    'Invalid input': 'Please check the education details and try again',
    'Database error': 'Unable to save the education entry. Please try again',
    'Unauthorized': 'You must be signed in to add education',
  },
  EDUCATION_UPDATE: {
    'Education not found': 'The education entry you are trying to update does not exist',
    'Invalid input': 'Please check the education details and try again',
    'Unauthorized': 'You do not have permission to update this education entry',
  },
  EDUCATION_DELETE: {
    'Education not found': 'The education entry you are trying to delete does not exist',
    'Unauthorized': 'You do not have permission to delete this education entry',
  },

  // Project messages
  PROJECT_CREATE: {
    'Invalid input': 'Please check the project details and try again',
    'Database error': 'Unable to save the project. Please try again',
    'Unauthorized': 'You must be signed in to create a project',
  },
  PROJECT_UPDATE: {
    'Project not found': 'The project you are trying to update does not exist',
    'Invalid input': 'Please check the project details and try again',
    'Unauthorized': 'You do not have permission to update this project',
  },
  PROJECT_DELETE: {
    'Project not found': 'The project you are trying to delete does not exist',
    'Unauthorized': 'You do not have permission to delete this project',
  },

  // Certification messages
  CERT_CREATE: {
    'Invalid input': 'Please check the certification details and try again',
    'Database error': 'Unable to save the certification. Please try again',
    'Unauthorized': 'You must be signed in to add a certification',
  },
  CERT_UPDATE: {
    'Certification not found': 'The certification you are trying to update does not exist',
    'Invalid input': 'Please check the certification details and try again',
    'Unauthorized': 'You do not have permission to update this certification',
  },
  CERT_DELETE: {
    'Certification not found': 'The certification you are trying to delete does not exist',
    'Unauthorized': 'You do not have permission to delete this certification',
  },
}

interface AuthError {
  message: string
  status?: number
}

export interface ErrorResult {
  message: string          // User-friendly message
  devMessage?: string      // Detailed message for development
  originalError?: unknown  // Original error object for debugging
}

export function handleClientError(error: unknown, code: ErrorCode): ErrorResult {
  const showDetails = process.env.NEXT_PUBLIC_SHOW_DETAILED_ERRORS === 'true'
  
  // Log error if details are enabled
  if (showDetails) {
    console.error(`[${code}]`, error)
  }

  // Handle Supabase AuthError objects
  if (error && typeof error === 'object' && 'message' in error) {
    const authError = error as AuthError
    const errorMessages = ERROR_MESSAGES[code]
    const userMessage = errorMessages[authError.message] || 'An unexpected error occurred. Please try again.'
    
    return {
      message: userMessage,
      devMessage: showDetails ? `Original error: ${authError.message}` : undefined,
      originalError: showDetails ? error : undefined
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    const errorMessages = ERROR_MESSAGES[code]
    const userMessage = errorMessages[error.message] || 'An unexpected error occurred. Please try again.'
    
    return {
      message: userMessage,
      devMessage: showDetails ? `Original error: ${error.message}\n${error.stack}` : undefined,
      originalError: showDetails ? error : undefined
    }
  }

  // For unknown errors
  return {
    message: 'An unexpected error occurred. Please try again.',
    devMessage: showDetails ? `Unknown error type: ${String(error)}` : undefined,
    originalError: showDetails ? error : undefined
  }
} 