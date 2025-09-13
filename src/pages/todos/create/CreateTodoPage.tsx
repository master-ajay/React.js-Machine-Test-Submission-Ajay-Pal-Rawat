import React, { useState } from 'react'
import { Box, Container, Typography, Paper, Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { ROUTES } from 'utils/routes'
import { useUserListing, useCreateTodo } from 'hooks'
import type { TodoFormData, FormErrors } from 'types'
import { useStyles } from './components/styles'
import { TodoForm } from './components/TodoForm'
import { FormActions } from './components/FormActions'
import { StatusMessages } from './components/StatusMessages'

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  assignedUser: z.number().min(1, 'Assigned user is required'),
  priority: z.enum(['low', 'high']).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['todo', 'inProgress', 'done']).default('todo'),
})

export function AddTodo() {
  const navigate = useNavigate()
  const { users, isLoading: usersLoading } = useUserListing()
  const { save: saveTodo, isLoading, error, success } = useCreateTodo()
  const styles = useStyles()

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    dueDate: '',
    assignedUser: 1,
    priority: 'high',
    tags: [],
    status: 'todo',
  })

  const [tagInput, setTagInput] = useState('')

  const handleInputChange =
    (field: keyof TodoFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }))

      if (formErrors[field]) {
        setFormErrors(prev => ({
          ...prev,
          [field]: '',
        }))
      }
    }

  const handleSelectChange = (field: keyof TodoFormData) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }))
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddTag()
    }
  }

  const validateForm = (): boolean => {
    try {
      todoSchema.parse(formData)
      setFormErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: FormErrors = {}
        error.issues.forEach(issue => {
          const field = issue.path[0] as string
          errors[field] = issue.message
        })
        setFormErrors(errors)
      }
      return false
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    await saveTodo(formData)
  }

  const goBackToList = () => navigate(ROUTES.todos.list)

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Box sx={styles.header}>
        <Button startIcon={<ArrowBack />} onClick={goBackToList} sx={styles.backButton}>
          Back to Todo List
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Add New Todo
        </Typography>
      </Box>

      <Paper sx={styles.paper}>
        <StatusMessages success={success} error={error} styles={styles} />

        <Box component="form" onSubmit={handleSubmit}>
          <TodoForm
            formData={formData}
            formErrors={formErrors}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onKeyPress={handleKeyPress}
            tagInput={tagInput}
            onTagInputChange={setTagInput}
            availableUsers={users}
            usersLoading={usersLoading}
            styles={styles}
          />

          <FormActions onCancel={goBackToList} isLoading={isLoading} styles={styles} />
        </Box>
      </Paper>
    </Container>
  )
}
