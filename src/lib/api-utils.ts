import type { AxiosError } from 'axios'

export function extractApiError(err: unknown, fallback = 'Something went wrong'): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as AxiosError<any>
    const data = axiosErr.response?.data

    if (typeof data === 'string' && data.trim().length > 0) {
      // Sometimes ASP.NET returns a plain string, e.g. Unauthorized("Invalid credentials")
      return data
    }

    if (axiosErr.response?.status === 401) {
      fallback = 'Unauthorized. Please check your credentials.'
    } else if (axiosErr.response?.status === 403) {
      fallback = 'Forbidden. You do not have permission to perform this action.'
    }

    // Handle specific backend error format with "error" object
    if (data?.error) {
      // If it's a validation error, extract all the detailed error messages
      if (data.error.details && typeof data.error.details === 'object') {
        const validationMessages = Object.values(data.error.details).flat().filter(Boolean)
        if (validationMessages.length > 0) {
          return validationMessages.join(' ')
        }
      }

      return data.error.message || fallback
    }

    // Handle ASP.NET Core ProblemDetails format
    if (data?.title) {
      if (data.errors && typeof data.errors === 'object') {
        const validationMessages = Object.values(data.errors).flat().filter(Boolean)
        if (validationMessages.length > 0) {
          return validationMessages.join(' ')
        }
      }
      return data.title
    }

    // Fallback for standard { message: "error" } format
    return data?.message ?? fallback
  }

  if (err instanceof Error) {
    return err.message
  }

  return fallback
}
