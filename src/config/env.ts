import { z } from 'zod'

const schema = z.object({
  VITE_APP_NAME: z.string().min(1),
  VITE_API_BASE_URL: z.string().url(),
  VITE_API_VERSION: z.string().regex(/^v[0-9]+$/),
  VITE_HOST: z.string().optional(),
  VITE_PORT: z.coerce.number().int().positive().optional(),
})

const parsed = schema.safeParse(import.meta.env)
if (!parsed.success) {
  console.error(parsed.error.format())
  throw new Error('Invalid environment variables')
}

export const APP_NAME = parsed.data.VITE_APP_NAME
export const API_BASE_URL = parsed.data.VITE_API_BASE_URL.replace(/\/+$/, '')
export const API_VERSION = parsed.data.VITE_API_VERSION
export const API_PREFIX = `/${API_VERSION}` // "/v1"
export const HOST = parsed.data.VITE_HOST ?? '127.0.0.1'
export const PORT = parsed.data.VITE_PORT ?? 5173
