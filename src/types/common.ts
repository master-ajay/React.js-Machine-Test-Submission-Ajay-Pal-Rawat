export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface ApiError {
  code: number
  message: string
  details?: any
}

export interface PaginationParams {
  page: number
  limit: number
  total: number
}

export interface SortParams {
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export type LoadingState = 'idle' | 'pending' | 'loading' | 'success' | 'error'

export interface LoadingStateProps {
  isLoading: boolean
  error: string | null
}

export type FormErrors = Record<string, string | undefined>

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  width?: string | number
  render?: (value: any, record: any) => React.ReactNode
}

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

export interface ComponentWithStyles {
  styles?: any
}

export type Status = 'active' | 'inactive' | 'pending' | 'deleted'

export interface TimestampFields {
  createdAt: string
  updatedAt: string
}
