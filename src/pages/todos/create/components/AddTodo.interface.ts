import type { TodoFormData, FormErrors } from 'types'

export interface AddTodoProps {
  className?: string
}

export interface TodoFormProps {
  formData: TodoFormData
  formErrors: FormErrors
  isLoading: boolean
  onInputChange: (
    field: keyof TodoFormData
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSelectChange: (field: keyof TodoFormData) => (event: any) => void
  onAddTag: () => void
  onRemoveTag: (tag: string) => void
  onKeyPress: (event: React.KeyboardEvent) => void
  tagInput: string
  onTagInputChange: (value: string) => void
  availableUsers: any[]
  usersLoading: boolean
  styles: any
}

export interface FormActionsProps {
  onCancel: () => void
  isLoading: boolean
  styles: any
}

export interface StatusMessagesProps {
  success: boolean
  error: string | null
  styles: any
}
