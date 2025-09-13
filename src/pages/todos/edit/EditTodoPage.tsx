import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material'
import { ArrowBack, Save, Delete } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { ROUTES } from 'utils/routes'
import { useUserListing, useTodoDetail, useUpdateTodo, useDeleteTodo } from 'hooks'
import type { TodoFormData, FormErrors, TodoStatus, TodoPriority } from 'types'
import { useStyles } from './components/styles'

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine(date => {
      const selectedDate = new Date(date)
      return !isNaN(selectedDate.getTime())
    }, 'Invalid date format')
    .refine(date => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, 'Due date cannot be in the past'),
  assignedUser: z.number().min(1, 'Assigned user is required'),
  priority: z.enum(['low', 'high']).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['todo', 'inProgress', 'done']),
})

export function EditTodo() {
  const navigate = useNavigate()
  const { todoId } = useParams<{ todoId: string }>()
  const { users, isLoading: usersLoading } = useUserListing()
  const { data: todo, isLoading: fetchLoading, error: fetchError } = useTodoDetail(todoId)
  const {
    save: updateTodo,
    isLoading: updateLoading,
    error: updateError,
    success: updateSuccess,
  } = useUpdateTodo()
  const {
    save: deleteTodo,
    isLoading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteTodo()
  const styles = useStyles()

  const isLoading = updateLoading || deleteLoading
  const error = updateError || deleteError
  const success = updateSuccess || deleteSuccess
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [tagInput, setTagInput] = useState('')

  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    status: 'todo' as TodoStatus,
    dueDate: '',
    assignedUser: 0,
    priority: 'low' as TodoPriority,
    tags: [],
  })

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        status: todo.status || 'todo',
        dueDate: todo.dueDate || '',
        assignedUser: todo.assignedUser || 0,
        priority: todo.priority || 'low',
        tags: todo.tags || [],
      })
    }
  }, [todo])

  const handleInputChange =
    (field: keyof TodoFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setFormData(prev => ({ ...prev, [field]: value }))
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: '' }))
      }
    }

  const handleSelectChange = (field: keyof TodoFormData) => (event: any) => {
    const value = field === 'assignedUser' ? parseInt(event.target.value) : event.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !formData.tags?.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), trimmedTag],
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormErrors({})

    const validationResult = todoSchema.safeParse(formData)

    if (!validationResult.success) {
      const errors: FormErrors = {}
      validationResult.error.issues.forEach((err: any) => {
        if (err.path.length > 0) {
          errors[err.path[0] as keyof FormErrors] = err.message
        }
      })
      setFormErrors(errors)
      return
    }

    await updateTodo({ id: todoId!, data: { ...formData, id: todoId! } })
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return
    }
    await deleteTodo(todoId!)
  }

  const goBackToList = () => navigate(ROUTES.todos.list)

  if (fetchLoading) {
    return (
      <Container maxWidth="md" sx={styles.container}>
        <Box sx={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (fetchError && !fetchLoading) {
    return (
      <Container maxWidth="md" sx={styles.container}>
        <Box sx={styles.errorContainer}>
          <Typography variant="h6" color="error" gutterBottom>
            {fetchError instanceof Error ? fetchError.message : 'Todo not found'}
          </Typography>
          <Button variant="contained" onClick={goBackToList} startIcon={<ArrowBack />}>
            Back to Todo List
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Box sx={styles.header}>
        <Button startIcon={<ArrowBack />} onClick={goBackToList} sx={styles.backButton}>
          Back to Todo List
        </Button>

        <Typography variant="h4" component="h1" sx={styles.title}>
          Edit Todo
        </Typography>
      </Box>

      <Paper sx={styles.paper}>
        {success && (
          <Alert severity="success" sx={styles.statusMessage}>
            Todo updated successfully! Redirecting...
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={styles.statusMessage}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
          <TextField
            fullWidth
            label="Title *"
            value={formData.title}
            onChange={handleInputChange('title')}
            error={!!formErrors['title']}
            helperText={formErrors['title']}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            label="Description *"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange('description')}
            error={!!formErrors['description']}
            helperText={formErrors['description']}
            disabled={isLoading}
          />

          <Box sx={styles.formRow}>
            <TextField
              fullWidth
              label="Due Date *"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange('dueDate')}
              error={!!formErrors['dueDate']}
              helperText={formErrors['dueDate']}
              disabled={isLoading}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
                max: new Date(new Date().getFullYear() + 10, 11, 31).toISOString().split('T')[0],
              }}
            />

            <FormControl fullWidth error={!!formErrors['assignedUser']}>
              <InputLabel>Assigned User *</InputLabel>
              <Select
                value={formData.assignedUser || ''}
                label="Assigned User *"
                onChange={handleSelectChange('assignedUser')}
                disabled={isLoading || usersLoading}
              >
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors['assignedUser'] && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {formErrors['assignedUser']}
                </Typography>
              )}
            </FormControl>
          </Box>

          <Box sx={styles.formRow}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleSelectChange('status')}
                disabled={isLoading}
              >
                <MenuItem value="todo">Todo</MenuItem>
                <MenuItem value="inProgress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority || 'low'}
                label="Priority"
                onChange={handleSelectChange('priority')}
                disabled={isLoading}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {formData.tags?.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  sx={styles.tagChip}
                  disabled={isLoading}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a tag"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button
                onClick={handleAddTag}
                variant="outlined"
                disabled={!tagInput.trim() || isLoading}
                sx={styles.addTagButton}
              >
                Add
              </Button>
            </Box>
          </Box>

          <Box sx={styles.formActions}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
              disabled={isLoading}
              sx={styles.deleteButton}
            >
              Delete
            </Button>

            <Button
              variant="outlined"
              onClick={goBackToList}
              disabled={isLoading}
              sx={styles.cancelButton}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
              disabled={isLoading}
              sx={styles.submitButton}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
