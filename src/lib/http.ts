import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import qs from 'qs'

type Tokens = { access?: string; refresh?: string }
let getTokens: (() => Tokens | undefined) | null = null
let onRotate: ((access?: string, refresh?: string) => void) | null = null
let onLogout: (() => void) | null = null

export function registerTokenProvider(fn: () => Tokens | undefined) {
  getTokens = fn
}
export function registerTokenRotationHandlers(opts: {
  onRotated?: (access?: string, refresh?: string) => void
  onLogout?: () => void
}) {
  onRotate = opts.onRotated ?? null
  onLogout = opts.onLogout ?? null
}

const API_BASE = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')
const API_VER = import.meta.env.VITE_API_VERSION

export const http: AxiosInstance = axios.create({
  baseURL: `${API_BASE}/${API_VER}`,
  paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'comma' }),
})

http.interceptors.request.use((config) => {
  const tokens = getTokens?.()
  if (tokens?.access) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${tokens.access}`
  }
  return config
})

http.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined
    const tokens = getTokens?.()

    if (error.response?.status === 401 && original && !original._retry && tokens?.refresh) {
      original._retry = true
      try {
        const { data } = await axios.post(`${API_BASE}/${API_VER}/auth/refresh`, {
          refreshToken: tokens.refresh,
        })
        const newAccess: string | undefined = data?.access?.value ?? data?.access
        const newRefresh: string | undefined = data?.refresh?.value ?? data?.refresh
        onRotate?.(newAccess, newRefresh)
        return http(original)
      } catch (e) {
        onLogout?.()
        throw e
      }
    }
    throw error
  },
)
