import { z } from 'zod'
import { VALIDATION } from 'utils/constants'

export const todoFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(
      VALIDATION.MAX_TITLE_LENGTH,
      `Title must be less than ${VALIDATION.MAX_TITLE_LENGTH} characters`
    ),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(
      VALIDATION.MAX_DESCRIPTION_LENGTH,
      `Description must be less than ${VALIDATION.MAX_DESCRIPTION_LENGTH} characters`
    ),

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

  status: z.enum(['todo', 'inProgress', 'done']).default('todo'),
})

export const todoFilterSchema = z.object({
  status: z.enum(['todo', 'inProgress', 'done', '']).optional(),
  priority: z.enum(['low', 'high', '']).optional(),
  assignedUser: z.number().optional(),
  search: z.string().optional(),
})

export const todoSortSchema = z.object({
  sortBy: z.enum(['title', 'dueDate']).default('dueDate'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type TodoFormData = z.infer<typeof todoFormSchema>
export type TodoFilters = z.infer<typeof todoFilterSchema>
export type TodoSort = z.infer<typeof todoSortSchema>
