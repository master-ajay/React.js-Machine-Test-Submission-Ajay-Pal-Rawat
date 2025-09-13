import { z } from 'zod'
import { ApiClient } from './api'
import { apiRoutes } from '../utils/routes/apiRoutes'
import {
  type User,
  type UserListParams,
  type CreateUserRequest,
  type UpdateUserRequest,
} from 'types'

const api = new ApiClient()

const UserSchema = z.any() as z.ZodType<User>
const UserListSchema = z.any() as z.ZodType<User[]>

const userListKey = () => 'users-list'
const userItemKey = (id: string) => `user-${id}`

export const getUsers = async (params?: UserListParams): Promise<User[]> => {
  const searchParams = new URLSearchParams()

  if (params) {
    if (params.name) searchParams.append('name', params.name)
    if (params.email) searchParams.append('email', params.email)

    if (params.sortBy) searchParams.append('_sort', params.sortBy)
    if (params.sortOrder) searchParams.append('_order', params.sortOrder)

    if (params.page) searchParams.append('_page', params.page.toString())
    if (params.limit) searchParams.append('_limit', params.limit.toString())
  }

  const url = searchParams.toString()
    ? `${apiRoutes.users.search}?${searchParams.toString()}`
    : apiRoutes.users.search

  return api.get<User[]>({
    url,
    responseSchema: UserListSchema,
  })
}

getUsers.getKey = userListKey

export const getUserById = async (id: string): Promise<User> => {
  const url = apiRoutes.users.detail(id)
  return api.get<User>({
    url,
    responseSchema: UserSchema,
  })
}

getUserById.getKey = userItemKey

export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  const newUser = {
    ...userData,
    id: Date.now().toString(),
  }

  const url = apiRoutes.users.root
  return api.post<User>({
    url,
    payload: newUser,
    responseSchema: UserSchema,
  })
}

createUser.getKey = userListKey

export const updateUser = async (id: string, userData: UpdateUserRequest): Promise<User> => {
  const url = apiRoutes.users.detail(id)
  return api.put<User>({
    url,
    payload: userData,
    responseSchema: UserSchema,
  })
}

updateUser.getKey = (id: string) => [userItemKey(id), userListKey()]

export const patchUser = async (
  id: string,
  userData: Partial<UpdateUserRequest>
): Promise<User> => {
  const url = apiRoutes.users.detail(id)
  return api.patch<User>({
    url,
    payload: userData,
    responseSchema: UserSchema,
  })
}

patchUser.getKey = (id: string) => [userItemKey(id), userListKey()]

export const deleteUser = async (id: string): Promise<void> => {
  const url = apiRoutes.users.detail(id)
  return api.delete<void>({
    url,
  })
}

deleteUser.getKey = (id: string) => [userItemKey(id), userListKey()]

export const searchUsers = async (query: string): Promise<User[]> => {
  return getUsers({ name: query, sortBy: 'name', sortOrder: 'asc' })
}

export const getUserOptions = async (): Promise<Array<{ value: number; label: string }>> => {
  const users = await getUsers({ sortBy: 'name', sortOrder: 'asc' })

  return users.map(user => ({
    value: parseInt(user.id),
    label: `${user.name} (${user.email})`,
  }))
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const users = await getUsers({ email })
  return users.length > 0 ? users[0] : null
}
