import { defineStore } from 'pinia'
import { http } from '@/lib/http'
import { api } from '@/lib/api'

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  role: 'super_admin' | 'admin' | 'customer'
}

type TokenLike = { value?: string } | string | undefined
const val = (t: TokenLike) => (typeof t === 'string' ? t : t?.value ?? '')

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: '' as string,
    refreshToken: '' as string,
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken,
    role: (s) => s.user?.role,
  },
  actions: {
    async login(email: string, password: string) {
      const { data } = await http.post<{ user: User; tokens: { access: TokenLike; refresh: TokenLike } }>(
        api.auth.login(),
        { email, password }
      )
      this.user = data.user
      this.accessToken = val(data.tokens.access)
      this.refreshToken = val(data.tokens.refresh)
    },
    async me() {
      const { data } = await http.get<{ user: User }>(api.auth.me())
      this.user = data.user
    },
    async logout() {
      try { await http.post(api.auth.logout()) } catch {}
      this.user = null
      this.accessToken = ''
      this.refreshToken = ''
    },
    setAccessToken(t: string) { this.accessToken = t },
    setRefreshToken(t: string) { this.refreshToken = t },
  },
})
