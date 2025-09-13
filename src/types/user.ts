export interface User {
  id: string
  name: string
  email: string
}

export interface UserFormData {
  name: string
  email: string
}

export type CreateUserRequest = UserFormData

export type UpdateUserRequest = Partial<UserFormData>

export interface UserFilters {
  name?: string
  email?: string
}

export interface UserListParams extends UserFilters {
  sortBy?: 'name' | 'email'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
