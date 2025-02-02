export function getErrorMessage(error: any, detailedMessage: string) {
  if (process.env.NEXT_PUBLIC_SHOW_DETAILED_ERRORS === 'true') {
    return detailedMessage
  }
  return 'An error occurred while processing your request'
}

export function getApiErrorResponse(error: any, context: string) {
  console.error(`[${context}]`, error)
  return new Response(
    getErrorMessage(error, `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}`),
    { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

export function getAuthErrorResponse(error: any, message: string) {
  return new Response(
    getErrorMessage(error, message),
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

export function getValidationErrorResponse(error: any, message: string) {
  return new Response(
    getErrorMessage(error, message),
    { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

// Client-side error handling
export function handleClientError(error: any, context: string) {
  const errorMessage = process.env.NEXT_PUBLIC_SHOW_DETAILED_ERRORS === 'true'
    ? `${context}: ${error instanceof Error ? error.message : 'Unknown error'}`
    : 'An error occurred. Please try again.'
    
  console.error(`[${context}]`, error)
  return errorMessage
} 