export const api = {
  auth: {
    login: () => '/auth/login',
    refresh: () => '/auth/refresh',
    me: () => '/auth/me',
    logout: () => '/auth/logout',
  },
  admin: {
    users: {
      list: (q?: Record<string, any>) => ({ url: '/admin/users', q }),
      create: () => '/admin/users',
      show: (id: string) => `/admin/users/${id}`,
      update: (id: string) => `/admin/users/${id}`,
      destroy: (id: string) => `/admin/users/${id}`,
      restore: (id: string) => `/admin/users/${id}/restore`,
    },
  },
} as const
