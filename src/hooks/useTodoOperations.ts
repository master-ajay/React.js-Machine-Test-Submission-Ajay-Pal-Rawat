import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiSave } from './useApiSave'
import { createTodo, updateTodo, deleteTodo, getTodos } from '../services/todoService'
import type { UpdateTodoRequest } from '../types'
import { ROUTES } from '../utils/routes'

export function useCreateTodo() {
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const { save, isLoading, error, data } = useApiSave({
    apiFn: createTodo,
    invalidateKeys: [getTodos.getKey()],
    onSuccess: () => {
      setSuccess(true)
      const timeoutId = setTimeout(() => {
        navigate(ROUTES.todos.list)
      }, 2000)

      return () => clearTimeout(timeoutId)
    },
    onError: error => {
      setSuccess(false)
      console.error('Failed to create todo:', error)
    },
  })

  return {
    save,
    isLoading,
    error,
    data,
    success,
  }
}

export function useUpdateTodo() {
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const { save, isLoading, error, data } = useApiSave({
    apiFn: ({ id, data }: { id: string; data: UpdateTodoRequest }) => updateTodo(id, data),
    invalidateKeys: [getTodos.getKey()],
    onSuccess: () => {
      setSuccess(true)
      const timeoutId = setTimeout(() => {
        navigate(ROUTES.todos.list)
      }, 2000)

      return () => clearTimeout(timeoutId)
    },
    onError: error => {
      setSuccess(false)
      console.error('Failed to update todo:', error)
    },
  })

  return {
    save,
    isLoading,
    error,
    data,
    success,
  }
}

export function useDeleteTodo() {
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const result = useApiSave({
    apiFn: deleteTodo,
    invalidateKeys: [getTodos.getKey()],
    onSuccess: () => {
      setSuccess(true)
      const timeoutId = setTimeout(() => {
        navigate(ROUTES.todos.list)
      }, 2000)

      return () => clearTimeout(timeoutId)
    },
    onError: error => {
      setSuccess(false)
      console.error('Failed to delete todo:', error)
    },
  })

  return {
    ...result,
    success,
  }
}
