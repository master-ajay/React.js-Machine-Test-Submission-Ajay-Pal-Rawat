export interface TodoListProps {
  className?: string
}

export interface SearchAndFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  userFilter: string
  onUserChange: (value: string) => void
  sortValue: string
  onSortChange: (value: string) => void
  availableUsers: number[]
  getUserName: (userId: number) => string
  styles: any
}

export interface TodosTableProps {
  todos: any[]
  currentPage: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
  onEditTodo: (id: string) => void
  onDeleteTodo: (id: string) => void
  getUserName: (userId: number) => string
  getStatusColor: (status: string) => string
  getPriorityColor: (priority?: string) => string
  styles: any
}

export interface PageHeaderProps {
  onAddTodo: () => void
  styles: any
}

export interface LoadingAndErrorProps {
  isLoading: boolean
  error: Error | null
  styles: any
}

export interface EmptyStateProps {
  onAddTodo: () => void
  styles: any
}
