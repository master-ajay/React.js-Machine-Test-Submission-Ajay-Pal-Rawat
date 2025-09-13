import { useState } from 'react'
import { useApiFetch } from './useApiFetch'
import { getUsers } from '../services/userService'
import type { UserListParams } from '../types'

export function useUserListing() {
  const [filters, setFilters] = useState<UserListParams>({})

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useApiFetch({
    apiFn: getUsers,
    params: filters,
    shouldFetch: true,
  })

  const updateFilters = (newFilters: Partial<UserListParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  return {
    users: users || [],
    isLoading,
    error,
    refetch,
    filters,
    updateFilters,
    clearFilters,
  }
}
