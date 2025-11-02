import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'

import { registerTokenProvider, registerTokenRotationHandlers } from '@/lib/http'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const auth = useAuthStore()
auth.loadFromStorage()

registerTokenProvider(() => ({ access: auth.accessToken, refresh: auth.refreshToken }))
registerTokenRotationHandlers({
  onRotated: (access, refresh) => {
    if (access) auth.setAccessToken(access)
    if (refresh) auth.setRefreshToken(refresh)
  },
  onLogout: () => auth.logout(),
})

app.use(router)

app.mount('#app')
