import type { AxiosError } from 'axios'

export function extractApiError(err: unknown, fallback = 'Something went wrong'): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as AxiosError<any>
    const data = axiosErr.response?.data

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

    // Fallback for standard { message: "error" } format
    return data?.message ?? fallback
  }

  if (err instanceof Error) {
    return err.message
  }

  return fallback
}
