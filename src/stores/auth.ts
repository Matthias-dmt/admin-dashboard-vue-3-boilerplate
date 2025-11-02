import { api } from '@/lib/api'
import { http } from '@/lib/http'
import { defineStore } from 'pinia'

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  role: 'super_admin' | 'admin' | 'customer'
}

type TokenLike = { value?: string } | string | undefined
const val = (t: TokenLike) => (typeof t === 'string' ? t : (t?.value ?? ''))

const LS = {
  access: 'auth.access',
  refresh: 'auth.refresh',
  user: 'auth.user',
}

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
    // -------- persistence
    saveToStorage() {
      if (this.accessToken) localStorage.setItem(LS.access, this.accessToken)
      if (this.refreshToken) localStorage.setItem(LS.refresh, this.refreshToken)
      if (this.user) localStorage.setItem(LS.user, JSON.stringify(this.user))
    },
    loadFromStorage() {
      this.accessToken = localStorage.getItem(LS.access) || ''
      this.refreshToken = localStorage.getItem(LS.refresh) || ''
      const u = localStorage.getItem(LS.user)
      this.user = u ? (JSON.parse(u) as User) : null
    },
    clearStorage() {
      localStorage.removeItem(LS.access)
      localStorage.removeItem(LS.refresh)
      localStorage.removeItem(LS.user)
    },

    // -------- auth flows
    async login(email: string, password: string) {
      const { data } = await http.post<{
        user: User
        tokens: { access: TokenLike; refresh: TokenLike }
      }>(api.auth.login(), { email, password })
      this.user = data.user
      this.accessToken = val(data.tokens.access)
      this.refreshToken = val(data.tokens.refresh)
      this.saveToStorage()
    },

    async me() {
      const { data } = await http.get<{ user: User }>(api.auth.me())
      this.user = data.user
      this.saveToStorage()
    },

    async refresh() {
      if (!this.refreshToken) throw new Error('No refresh token')
      const { data } = await http.post<{ access: TokenLike; refresh?: TokenLike }>(
        api.auth.refresh(),
        {
          refreshToken: this.refreshToken,
        },
      )
      this.accessToken = val(data.access)
      if (data.refresh) this.refreshToken = val(data.refresh)
      this.saveToStorage()
    },

    async logout() {
      try {
        await http.post(api.auth.logout())
      } catch {}
      this.user = null
      this.accessToken = ''
      this.refreshToken = ''
      this.clearStorage()
    },

    setAccessToken(t: string) {
      this.accessToken = t
      this.saveToStorage()
    },
    setRefreshToken(t: string) {
      this.refreshToken = t
      this.saveToStorage()
    },

    // -------- silent auth on app boot
    async silentAuth() {
      if (!this.accessToken && !this.refreshToken) return false
      try {
        // Try current access token
        await this.me()
        return true
      } catch {
        // Try refresh if available
        if (!this.refreshToken) {
          await this.logout()
          return false
        }
        try {
          await this.refresh()
          await this.me()
          return true
        } catch {
          await this.logout()
          return false
        }
      }
    },
  },
})
