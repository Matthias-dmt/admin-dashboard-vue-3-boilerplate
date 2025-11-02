import type { Role } from '@/constants/roles'
import { api } from '@/lib/api'
import { http } from '@/lib/http'

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  role: Role
  lastLoginAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export type Paginated<T> = {
  data: T[]
  meta: { total: number; perPage: number; currentPage: number; lastPage: number }
}

export async function listUsers(params?: {
  page?: number
  perPage?: number
  search?: string
  sort?: string
}) {
  const { url, q } = api.admin.users.list(params)
  const { data } = await http.get<Paginated<User>>(url, { params: q })
  return data
}

export async function getUser(id: string) {
  const { data } = await http.get<{ data: User }>(api.admin.users.show(id))
  return data.data
}

export async function createUser(payload: {
  email: string
  password: string
  firstName: string
  lastName: string
  isActive?: boolean
  role: Role
}) {
  const { data } = await http.post<{ data: User }>(api.admin.users.create(), payload)
  return data.data
}

export async function updateUser(id: string, payload: Partial<Omit<User, 'id'>>) {
  const { data } = await http.patch<{ data: User }>(api.admin.users.update(id), payload)
  return data.data
}

export async function deleteUser(id: string) {
  await http.delete(api.admin.users.destroy(id))
}

export async function restoreUser(id: string) {
  const { data } = await http.post<{ data: User }>(api.admin.users.restore(id))
  return data.data
}
