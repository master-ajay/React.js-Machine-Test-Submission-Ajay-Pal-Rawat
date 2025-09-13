import { useState, useCallback, useMemo } from 'react'
import { useApiFetch } from './useApiFetch'
import { getTodos } from '../services/todoService'
import type { TodoListParams } from '../types'

export function useTodoListing() {
  const [filters, setFilters] = useState<TodoListParams>({})

  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)])

  const {
    data: todos,
    isLoading,
    error,
    refetch,
  } = useApiFetch({
    apiFn: getTodos,
    params: memoizedFilters,
    shouldFetch: true,
  })

  const updateFilters = useCallback((newFilters: Partial<TodoListParams>) => {
    setFilters(prev => {
      const updated = { ...prev }

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined) {
          delete updated[key as keyof TodoListParams]
        } else {
          ;(updated as any)[key] = value
        }
      })

      return updated
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  return {
    todos: todos || [],
    isLoading,
    error,
    refetch,
    filters,
    updateFilters,
    clearFilters,
  }
}
