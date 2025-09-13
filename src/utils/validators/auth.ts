import { z } from 'zod'
import { VALIDATION } from 'utils/constants'

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(
      VALIDATION.MIN_USERNAME_LENGTH,
      `Username must be at least ${VALIDATION.MIN_USERNAME_LENGTH} characters`
    ),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(
      VALIDATION.MIN_PASSWORD_LENGTH,
      `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`
    ),
})

export const authResponseSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type LoginFormData = z.infer<typeof loginFormSchema>
export type AuthResponseData = z.infer<typeof authResponseSchema>
