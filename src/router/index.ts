import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const Login = () => import('@/views/Login.vue')
const AppLayout = () => import('@/layouts/AppLayout.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const UsersList = () => import('@/views/users/UsersList.vue')
const UserForm = () => import('@/views/users/UserForm.vue')

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: Login, meta: { public: true } },

  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: Dashboard },
      { path: 'users', name: 'users-list', component: UsersList },
      { path: 'users/create', name: 'users-create', component: UserForm },
      { path: 'users/:id/edit', name: 'users-edit', component: UserForm, props: true },
    ],
  },

  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (to.meta.public) return true

  if (!auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (!auth.user) {
    try {
      await auth.me()
    } catch {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }
  return true
})

export default router
