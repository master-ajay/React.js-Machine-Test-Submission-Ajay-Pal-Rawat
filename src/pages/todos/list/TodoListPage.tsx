import { useState, useEffect, useMemo } from 'react'
import { Box, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from 'utils/routes'
import { useTodoListing, useUserListing, useDeleteTodo } from 'hooks'
import type { Todo } from 'types'
import { useStyles } from './components/styles'
import { PageHeader } from './components/PageHeader'
import { SearchAndFilters } from './components/SearchAndFilters'
import { LoadingAndError } from './components/LoadingAndError'
import { TodosTable } from './components/TodosTable'
import { EmptyState } from './components/EmptyState'

export function TodoList() {
  const navigate = useNavigate()
  const styles = useStyles()

  const [currentPage, setCurrentPage] = useState(0)
  const [todosPerPage, setTodosPerPage] = useState(10)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [sortBy, setSortBy] = useState<'dueDate' | 'title'>('dueDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const {
    todos,
    isLoading: todosLoading,
    error: todosError,
    updateFilters,
    refetch: refreshTodos,
  } = useTodoListing()

  const { users } = useUserListing()
  const { save: deleteTodoFn, isLoading: isDeleting } = useDeleteTodo()

  useEffect(() => {
    const filters: any = {}

    if (debouncedSearch) {
      filters.search = debouncedSearch
    } else {
      filters.search = undefined
    }

    if (statusFilter) {
      filters.status = statusFilter
    } else {
      filters.status = undefined
    }

    if (userFilter) {
      filters.assignedUser = parseInt(userFilter)
    } else {
      filters.assignedUser = undefined
    }

    if (sortBy) filters.sortBy = sortBy
    if (sortOrder) filters.sortOrder = sortOrder

    updateFilters(filters)
  }, [debouncedSearch, statusFilter, userFilter, sortBy, sortOrder, updateFilters])

  const handleDeleteTodo = async (todoId: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodoFn(todoId)
        refreshTodos()
      } catch (err) {
        console.error('Failed to delete todo:', err)
      }
    }
  }

  const findUserName = (userId: number): string => {
    const user = users.find(u => parseInt(u.id) === userId)
    return user ? user.name : `User ${userId}`
  }

  const availableUsers = useMemo(() => {
    if (!todos || todos.length === 0) return []
    return Array.from(
      new Set(todos.map((todo: Todo) => todo.assignedUser).filter(Boolean))
    ) as number[]
  }, [todos])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'success'
      case 'inProgress':
        return 'warning'
      case 'in-progress':
        return 'warning'
      case 'todo':
        return 'default'
      default:
        return 'default'
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'info'
      default:
        return 'default'
    }
  }

  const paginatedTodos = useMemo(() => {
    const startIndex = currentPage * todosPerPage
    return todos.slice(startIndex, startIndex + todosPerPage)
  }, [todos, currentPage, todosPerPage])

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-')
    setSortBy(field as 'dueDate' | 'title')
    setSortOrder(order as 'asc' | 'desc')
  }

  const navigateToAdd = () => navigate(ROUTES.todos.add)
  const navigateToEdit = (todoId: string) => navigate(ROUTES.todos.edit(todoId))

  const isLoading = todosLoading || isDeleting

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Box sx={styles.header}>
        <PageHeader onAddTodo={navigateToAdd} styles={styles} />

        <SearchAndFilters
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          userFilter={userFilter}
          onUserChange={setUserFilter}
          sortValue={`${sortBy}-${sortOrder}`}
          onSortChange={handleSortChange}
          availableUsers={availableUsers}
          getUserName={findUserName}
          styles={styles}
        />

        <LoadingAndError
          isLoading={isLoading}
          error={todosError ? new Error(todosError.message) : null}
          styles={styles}
        />

        {!isLoading && !todosError && todos.length > 0 && (
          <TodosTable
            todos={paginatedTodos}
            currentPage={currentPage}
            itemsPerPage={todosPerPage}
            totalItems={todos.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setTodosPerPage}
            onEditTodo={navigateToEdit}
            onDeleteTodo={handleDeleteTodo}
            getUserName={findUserName}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            styles={styles}
          />
        )}

        {!isLoading && !todosError && todos.length === 0 && (
          <EmptyState onAddTodo={navigateToAdd} styles={styles} />
        )}
      </Box>
    </Container>
  )
}
