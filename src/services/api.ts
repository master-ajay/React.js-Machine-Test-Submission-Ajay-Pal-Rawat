import { z } from 'zod'
import { ENV } from 'utils/constants/env'

export interface ApiRequestParams<T = any> {
  url: string
  payload?: any
  requestSchema?: z.ZodType<any>
  responseSchema?: z.ZodType<T>
  requestTransformer?: (data: any) => any
  responseTransformer?: (data: any) => T
  options?: RequestInit
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = ENV.API_BASE_URL) {
    this.baseURL = baseURL
  }

  private handleError(error: any): never {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new NetworkError({ cause: error })
    }

    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError('UNKNOWN_API_ERROR', -1, {
      cause: error,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    })
  }

  private validateInput(schema: z.ZodType<any>, data: any, endpoint: string): any {
    const result = schema.safeParse(data)

    if (!result.success) {
      throw new RequestValidationError(result.error, {
        endpoint,
        receivedData: data,
      })
    }
    return result.data
  }

  private validateOutput<T>(schema: z.ZodType<T>, data: any, endpoint: string): T {
    const result = schema.safeParse(data)

    if (!result.success) {
      const error = new ResponseValidationError(result.error, {
        endpoint,
        receivedData: data,
      })

      error.setMessage(
        `Invalid data in ${result.error.issues[0].path.join(' -> ')}. ${result.error.issues[0].message}`
      )

      throw error
    }
    return result.data
  }

  private async getRequestHeaders(): Promise<Record<string, string>> {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private http =
    (method: HttpMethod) =>
    async <T = any>(params: ApiRequestParams<T>): Promise<T> => {
      const {
        url,
        payload,
        requestSchema,
        responseSchema,
        requestTransformer,
        responseTransformer,
        options = {},
      } = params

      try {
        let validatedPayload = payload

        if (payload && requestSchema) {
          validatedPayload = this.validateInput(requestSchema, payload, url)
        }

        const transformedPayload =
          requestTransformer && payload !== undefined
            ? requestTransformer(payload)
            : validatedPayload

        const finalPayload = requestTransformer ? transformedPayload : validatedPayload

        const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`

        const config: RequestInit = {
          method,
          headers: {
            ...(await this.getRequestHeaders()),
            ...options.headers,
          },
          ...(finalPayload && method !== 'GET' && { body: JSON.stringify(finalPayload) }),
          ...options,
        }

        const response = await fetch(fullUrl, config)

        if (!response.ok) {
          const errorText = await response.text()
          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch {
            errorData = { message: errorText }
          }

          switch (response.status) {
            case 400:
              throw new ValidationError(errorData.errors || [errorData.message], {
                cause: response,
              })
            case 401:
              throw new AuthenticationError()
            case 403:
              throw new AuthenticationError()
            case 404:
              throw new ApiError('NOT_FOUND', response.status, {
                cause: response,
                message: errorData?.message || 'Resource not found',
              })
            default:
              throw new ApiError('UNKNOWN_API_ERROR', response.status, {
                cause: response,
                message: errorData?.message || `HTTP error! status: ${response.status}`,
              })
          }
        }

        const contentType = response.headers.get('content-type')
        let data: any

        if (contentType && contentType.includes('application/json')) {
          data = await response.json()
        } else {
          data = {}
        }

        let validatedResponse: T = data

        if (responseSchema) {
          validatedResponse = this.validateOutput(responseSchema, data, url)
        }

        const transformedResponse = responseTransformer
          ? responseTransformer(data)
          : validatedResponse

        return responseTransformer ? transformedResponse : validatedResponse
      } catch (error) {
        this.handleError(error)
      }
    }

  get = <T = any>(params: ApiRequestParams<T>) => this.http('GET')<T>(params)

  post = <T = any>(params: ApiRequestParams<T>) => this.http('POST')<T>(params)

  put = <T = any>(params: ApiRequestParams<T>) => this.http('PUT')<T>(params)

  patch = <T = any>(params: ApiRequestParams<T>) => this.http('PATCH')<T>(params)

  delete = <T = any>(params: ApiRequestParams<T>) => this.http('DELETE')<T>(params)
}

export const apiClient = new ApiClient()

export class ApiError extends Error {
  public code: string
  public status: number
  public override cause?: any

  constructor(
    code: string,
    status: number,
    { cause, message }: { cause?: any; message?: string } = {}
  ) {
    super(message || code)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.cause = cause
  }
}

export class ValidationError extends ApiError {
  public errors: any[]

  constructor(errors: any[], options?: { cause?: any }) {
    super('VALIDATION_ERROR', 400, {
      message: 'Validation failed',
      ...options,
    })
    this.errors = errors
  }
}

export class AuthenticationError extends ApiError {
  constructor() {
    super('AUTHENTICATION_ERROR', 401, {
      message: 'Authentication failed',
    })
  }
}

export class NetworkError extends ApiError {
  constructor({ cause }: { cause?: any } = {}) {
    super('NETWORK_ERROR', 0, {
      message: 'Network error occurred',
      cause,
    })
  }
}

export class RequestValidationError extends ApiError {
  public zodError: z.ZodError
  public endpoint: string
  public receivedData: any

  constructor(
    zodError: z.ZodError,
    { endpoint, receivedData }: { endpoint: string; receivedData: any }
  ) {
    super('REQUEST_VALIDATION_ERROR', 400, {
      message: 'Request validation failed',
    })
    this.zodError = zodError
    this.endpoint = endpoint
    this.receivedData = receivedData
  }
}

export class ResponseValidationError extends ApiError {
  public zodError: z.ZodError
  public endpoint: string
  public receivedData: any

  constructor(
    zodError: z.ZodError,
    { endpoint, receivedData }: { endpoint: string; receivedData: any }
  ) {
    super('RESPONSE_VALIDATION_ERROR', 500, {
      message: 'Response validation failed',
    })
    this.zodError = zodError
    this.endpoint = endpoint
    this.receivedData = receivedData
  }

  setMessage(message: string) {
    this.message = message
  }
}
