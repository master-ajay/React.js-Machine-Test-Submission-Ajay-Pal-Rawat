import { z } from 'zod'
import { ApiClient } from './api'
import { apiRoutes } from '../utils/routes/apiRoutes'
import {
  type Todo,
  type TodoListParams,
  type CreateTodoRequest,
  type UpdateTodoRequest,
} from 'types'

const api = new ApiClient()

const TodoSchema = z.any() as z.ZodType<Todo>
const TodoListSchema = z.any() as z.ZodType<Todo[]>

const todoListKey = (params?: TodoListParams) => {
  if (!params || Object.keys(params).length === 0) {
    return 'todos-list'
  }

  const keyParts = ['todos-list']
  const sortedParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))

  for (const [key, value] of sortedParams) {
    keyParts.push(`${key}:${value}`)
  }

  return keyParts.join('|')
}

const todoItemKey = (id: string) => `todo-${id}`

export const getTodos = async (params?: TodoListParams): Promise<Todo[]> => {
  const searchParams = new URLSearchParams()

  if (params) {
    if (params.status) searchParams.append('status', params.status)
    if (params.priority) searchParams.append('priority', params.priority)
    if (params.assignedUser) searchParams.append('assignedUser', params.assignedUser.toString())
    if (params.search) searchParams.append('title_like', params.search)

    if (params.sortBy) searchParams.append('_sort', params.sortBy)
    if (params.sortOrder) searchParams.append('_order', params.sortOrder)

    if (params.page) searchParams.append('_page', params.page.toString())
    if (params.limit) searchParams.append('_limit', params.limit.toString())
  }

  const url = searchParams.toString()
    ? `${apiRoutes.todos.search}?${searchParams.toString()}`
    : apiRoutes.todos.search

  return api.get<Todo[]>({
    url,
    responseSchema: TodoListSchema,
  })
}

getTodos.getKey = todoListKey

export const getTodoById = async (id: string): Promise<Todo> => {
  const url = apiRoutes.todos.detail(id)
  return api.get<Todo>({
    url,
    responseSchema: TodoSchema,
  })
}

getTodoById.getKey = todoItemKey

export const createTodo = async (todoData: CreateTodoRequest): Promise<Todo> => {
  const newTodo = {
    ...todoData,
    id: Date.now().toString(),
  }

  const url = apiRoutes.todos.root
  return api.post<Todo>({
    url,
    payload: newTodo,
    responseSchema: TodoSchema,
  })
}

createTodo.getKey = () => todoListKey()

export const updateTodo = async (id: string, todoData: UpdateTodoRequest): Promise<Todo> => {
  const url = apiRoutes.todos.detail(id)
  return api.put<Todo>({
    url,
    payload: todoData,
    responseSchema: TodoSchema,
  })
}

updateTodo.getKey = (id: string) => [todoItemKey(id), todoListKey()]

export const patchTodo = async (
  id: string,
  todoData: Partial<UpdateTodoRequest>
): Promise<Todo> => {
  const url = apiRoutes.todos.detail(id)
  return api.patch<Todo>({
    url,
    payload: todoData,
    responseSchema: TodoSchema,
  })
}

patchTodo.getKey = (id: string) => [todoItemKey(id), todoListKey()]

export const deleteTodo = async (id: string): Promise<void> => {
  const url = apiRoutes.todos.detail(id)
  return api.delete<void>({
    url,
  })
}

deleteTodo.getKey = (id: string) => [todoItemKey(id), todoListKey()]

export const getTodosByStatus = async (status: 'todo' | 'inProgress' | 'done'): Promise<Todo[]> => {
  return getTodos({ status, sortBy: 'dueDate', sortOrder: 'asc' })
}

export const getTodosByUser = async (userId: number): Promise<Todo[]> => {
  return getTodos({ assignedUser: userId, sortBy: 'dueDate', sortOrder: 'asc' })
}

export const searchTodos = async (query: string): Promise<Todo[]> => {
  return getTodos({ search: query, sortBy: 'title', sortOrder: 'asc' })
}

export const getTodoStats = async (): Promise<{
  total: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
}> => {
  const todos = await getTodos()

  const stats = {
    total: todos.length,
    byStatus: todos.reduce(
      (acc, todo) => {
        acc[todo.status] = (acc[todo.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    ),
    byPriority: todos.reduce(
      (acc, todo) => {
        if (todo.priority) {
          acc[todo.priority] = (acc[todo.priority] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>
    ),
  }

  return stats
}
