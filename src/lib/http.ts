import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import qs from 'qs'
import { API_BASE_URL, API_PREFIX } from '@/config/env'
import { useAuthStore } from '@/stores/auth'

let refreshing = false
let queue: Array<() => void> = []

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL + API_PREFIX,
  paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'comma' }),
})

http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth?.accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

http.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const auth = useAuthStore()
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined

    if (error.response?.status === 401 && original && !original._retry && auth?.refreshToken) {
      original._retry = true

      if (!refreshing) {
        refreshing = true
        try {
          const { data } = await axios.post(API_BASE_URL + `${API_PREFIX}/auth/refresh`, {
            refreshToken: auth.refreshToken,
          })
          const newAccess = data?.access?.value ?? data?.access
          if (newAccess) auth.setAccessToken(newAccess)
          const newRefresh = data?.refresh?.value ?? data?.refresh
          if (newRefresh) auth.setRefreshToken(newRefresh)
          refreshing = false
          queue.splice(0).forEach((fn) => fn())
          return http(original)
        } catch (e) {
          refreshing = false
          queue.splice(0)
          auth?.logout()
          throw e
        }
      }

      return new Promise((resolve) => {
        queue.push(() => resolve(http(original)))
      })
    }

    throw error
  }
)
