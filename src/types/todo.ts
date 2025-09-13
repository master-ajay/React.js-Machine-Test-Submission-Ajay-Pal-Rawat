import type { BaseFilter, ListApiPayload, ListApiResponse, ListFilter, AuditFields } from './index'

export type TodoStatus = 'todo' | 'inProgress' | 'done'
export type TodoPriority = 'low' | 'high'

export interface Todo extends Partial<AuditFields> {
  id: string
  title: string
  description: string
  status: TodoStatus
  dueDate: string
  assignedUser: number
  priority?: TodoPriority
  tags?: string[]
}

export interface CreateTodoDto extends Omit<Todo, 'id' | keyof AuditFields> {
  assignedUser: number
  priority?: TodoPriority
  status: TodoStatus
}

export interface UpdateTodoDto extends Partial<Omit<Todo, 'id'>> {
  id: string
}

export interface GetTodoDto extends Todo {
  id: string
  assignedUser: number
}

export type TodoFormData = Omit<Todo, 'id' | keyof AuditFields>

export interface TodoFilters {
  status?: TodoStatus
  priority?: TodoPriority
  assignedUser?: number
  search?: string
}

export type TodoSortOptions = 'title' | 'dueDate' | 'status' | 'priority'

export interface TodoListParams extends ListApiPayload<Todo> {
  search?: string
  status?: TodoStatus
  assignedUser?: number
  priority?: TodoPriority
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export type ListTodoRequest = Omit<ListApiPayload<GetTodoDto>, 'filters'> & {
  filters: (ListFilter<GetTodoDto> | BaseFilter)[]
}

export type CreateTodoRequest = CreateTodoDto

export type UpdateTodoRequest = UpdateTodoDto

export type ListTodoApiParams = ListApiPayload<GetTodoDto>
export type ListTodoResponse = ListApiResponse<GetTodoDto>

export interface TodoApiResponse {
  success: boolean
  data?: Todo
  message?: string
  errors?: string[]
}

export type SearchTodoParams = TodoListParams
export type SearchTodoResponse = ListApiResponse<Todo>
