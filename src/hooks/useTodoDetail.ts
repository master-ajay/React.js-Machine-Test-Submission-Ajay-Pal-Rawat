import { useApiFetch } from './useApiFetch'
import { getTodoById } from '../services/todoService'
import type { Todo } from '../types'

export function useTodoDetail(todoId?: string) {
  return useApiFetch<string, Todo>({
    apiFn: getTodoById,
    params: todoId,
    shouldFetch: !!todoId,
    onError: error => {
      console.error('Failed to fetch todo:', error)
    },
  })
}
