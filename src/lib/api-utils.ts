import type { AxiosError } from 'axios'

export function extractApiError(err: unknown, fallback = 'Something went wrong'): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as AxiosError<{ message?: string }>
    return axiosErr.response?.data?.message ?? fallback
  }
  return fallback
}
