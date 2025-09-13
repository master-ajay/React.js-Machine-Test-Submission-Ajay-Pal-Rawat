import useSWR from 'swr'
import type {
  ApiFunctionWithoutParams,
  ApiFunctionWithParams,
  UseApiFetchOptions,
  UseApiFetchReturn,
} from './types'

function getErrorDetails(error: any): { code: number; message: string } {
  return {
    code: error?.status || error?.code || -1,
    message: error?.message || 'An error occurred',
  }
}

export function useApiFetch<TParams, TResponse, TTransformed = TResponse>(
  options: UseApiFetchOptions<TParams, TResponse, TTransformed>
): UseApiFetchReturn<TResponse, TTransformed> {
  const { params, apiFn, shouldFetch = true, onError, onSuccess, transform, swrConfig } = options

  let key = null

  if (shouldFetch) {
    const cacheKey =
      params !== undefined
        ? (apiFn as ApiFunctionWithParams<TParams, TResponse>).getKey(params)
        : (apiFn as ApiFunctionWithoutParams<TResponse>).getKey()

    key = params !== undefined ? [cacheKey, params] : [cacheKey]
  }

  const fetchFunction = async (): Promise<TResponse> => {
    try {
      let returnValue: TResponse

      if (params !== undefined) {
        returnValue = await (apiFn as ApiFunctionWithParams<TParams, TResponse>)(params)
      } else {
        returnValue = await (apiFn as ApiFunctionWithoutParams<TResponse>)()
      }

      if (onSuccess) {
        onSuccess(returnValue)
      }

      return returnValue
    } catch (err) {
      if (onError) {
        onError(err)
      }
      throw err
    }
  }

  const {
    data,
    error: swrError,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<TResponse, Error>(key, fetchFunction, swrConfig)

  const transformedData = transform ? transform(data) : (data as unknown as TTransformed)

  return {
    data,
    transformedData,
    isLoading,
    isValidating,
    error: swrError ? getErrorDetails(swrError) : undefined,
    refetch: mutate,
  }
}
