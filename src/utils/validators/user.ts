import { z } from 'zod'

export const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),

  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

export const userFilterSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
})

export const userSortSchema = z.object({
  sortBy: z.enum(['name', 'email']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type UserFormData = z.infer<typeof userFormSchema>
export type UserFilters = z.infer<typeof userFilterSchema>
export type UserSort = z.infer<typeof userSortSchema>
