export type ApiFunctionWithParams<Params, Response> = {
  (params: Params): Promise<Response>
  getKey: (params: Params) => string | string[]
}

export type ApiFunctionWithoutParams<Response> = {
  (): Promise<Response>
  getKey: () => string | string[]
}

export type ApiFunction<Params, Response> =
  | ApiFunctionWithParams<Params, Response>
  | ApiFunctionWithoutParams<Response>

export interface UseApiFetchOptions<TParams, TResponse, TTransformed = TResponse> {
  apiFn: ApiFunction<TParams, TResponse>
  params?: TParams | undefined
  shouldFetch?: boolean
  onError?: (error: unknown) => void
  onSuccess?: (data: TResponse) => void
  transform?: (data?: TResponse) => TTransformed
  swrConfig?: any
}

export interface UseApiFetchReturn<TResponse, TTransformed = TResponse> {
  data: TResponse | undefined
  transformedData: TTransformed
  isLoading: boolean
  isValidating: boolean
  error: { code: number; message: string } | undefined
  refetch: () => Promise<TResponse | undefined>
}

export interface UseApiSaveOptions<TRequest, TResponse> {
  apiFn: (data: TRequest) => Promise<TResponse>
  onSuccess?: (data: TResponse) => void
  onError?: (error: unknown) => void
  invalidateKeys?: string[]
}

export interface UseApiSaveReturn<TRequest, TResponse> {
  save: (data: TRequest) => Promise<void>
  isLoading: boolean
  error: string | null
  data: TResponse | null
}
