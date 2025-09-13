export interface DefaultPayload {
  currentPage: number
  pageSize: number
  includeDeletedRecords: boolean
}

export interface ListApiPayload<T> extends Partial<DefaultPayload> {
  filters?: ListFilter<T>[]
  sorts?: ListSort<T>[]
}

export type BaseFilter = {
  propertyName: string
  propertyValue: string | number | boolean
  comparison: 'Equals' | 'Contains' | 'GreaterThan' | 'LessThan'
}

export type ListFilter<T> = Omit<BaseFilter, 'propertyName'> & {
  propertyName: keyof T
}

export type ListSort<T> = {
  propertyName: keyof T | (string & {})
  direction: 'ASC' | 'DESC'
}

export interface ListApiResponse<TItem> {
  currentPage: number
  items: TItem[]
  totalRecords: number
}

export type PartialK<T, K extends PropertyKey = PropertyKey> = Partial<
  Pick<T, Extract<keyof T, K>>
> &
  Omit<T, K> extends infer O
  ? { [P in keyof O]: O[P] }
  : never

export type RequiredK<T, K extends keyof T> = Required<Pick<T, K>> &
  Partial<Omit<T, K>> extends infer O
  ? { [P in keyof O]: O[P] }
  : never

export interface AuditFields {
  createdBy: number
  createdDate: string
  modifiedBy: null | number
  modifiedDate: null | string
  isDeleted: boolean
}

export type TransformFn<T, U> = (values: T) => U

export type MakeOptional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

export type {
  User as AuthUser,
  AuthCredentials,
  AuthResponse,
  AuthState,
  LoginFormData,
  AuthContextType,
} from './auth'

export type {
  Todo,
  TodoStatus,
  TodoPriority,
  TodoFormData,
  TodoFilters,
  TodoSortOptions,
  TodoListParams,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoApiResponse,
  CreateTodoDto,
  UpdateTodoDto,
  GetTodoDto,
} from './todo'

export type {
  User,
  UserFormData,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
  UserListParams,
} from './user'

export type {
  ApiResponse,
  ApiError,
  PaginationParams,
  SortParams,
  LoadingState,
  LoadingStateProps,
  FormErrors,
  SelectOption,
  TableColumn,
  ConfirmDialogProps,
} from './common'
