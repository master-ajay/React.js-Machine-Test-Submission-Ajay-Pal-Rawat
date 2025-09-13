import { useState } from 'react'
import { mutate } from 'swr'
import type { UseApiSaveOptions, UseApiSaveReturn } from './types'

export function useApiSave<TRequest, TResponse>(
  options: UseApiSaveOptions<TRequest, TResponse>
): UseApiSaveReturn<TRequest, TResponse> {
  const { apiFn, onSuccess, onError, invalidateKeys } = options

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TResponse | null>(null)

  const save = async (requestData: TRequest): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiFn(requestData)
      setData(response)

      if (invalidateKeys && invalidateKeys.length > 0) {
        invalidateKeys.forEach(key => {
          mutate(key)
        })
      }

      if (onSuccess) {
        onSuccess(response)
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred'
      setError(errorMessage)

      if (onError) {
        onError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    save,
    isLoading,
    error,
    data,
  }
}
