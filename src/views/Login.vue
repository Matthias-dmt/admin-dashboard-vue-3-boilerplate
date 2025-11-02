<template>
  <div class="min-h-screen grid place-items-center bg-gray-50 p-6">
    <div class="w-full max-w-sm rounded-2xl bg-white shadow ring-1 ring-black/5 p-6">
      <h1 class="text-xl font-semibold mb-1">Sign in</h1>
      <p class="text-sm text-gray-600 mb-6">Admin access</p>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700" for="email">Email</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            autocomplete="username"
            class="mt-1 block w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-black/10"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700" for="password">Password</label>
          <input
            id="password"
            v-model.trim="form.password"
            type="password"
            autocomplete="current-password"
            class="mt-1 block w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-black/10"
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
        </div>

        <button
          :disabled="submitting"
          class="inline-flex w-full items-center justify-center rounded-lg px-4 py-2 font-medium text-white bg-black hover:bg-black/90 disabled:opacity-50"
        >
          <svg v-if="submitting" class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              class="opacity-25"
            />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span>Sign in</span>
        </button>

        <p v-if="serverError" class="text-sm text-red-600">{{ serverError }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({
  email: 'admin@example.com',
  password: 'helloWorld',
})

const errors = reactive<{ email?: string; password?: string }>({})
const serverError = ref('')
const submitting = ref(false)

function validate() {
  errors.email = form.email ? undefined : 'Email is required'
  errors.password = form.password ? undefined : 'Password is required'
  return !errors.email && !errors.password
}

async function onSubmit() {
  serverError.value = ''
  if (!validate()) return
  submitting.value = true
  try {
    await auth.login(form.email, form.password)
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } catch (e: any) {
    serverError.value = e?.response?.data?.error?.message || 'Invalid credentials'
  } finally {
    submitting.value = false
  }
}
</script>
