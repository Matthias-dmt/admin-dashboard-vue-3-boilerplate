<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold tracking-tight">{{ isEdit ? 'Edit user' : 'New user' }}</h1>
      <RouterLink
        to="/users"
        type="button"
        class="inline-flex items-center rounded-lg btn px-4 py-2 text-sm font-medium"
      >
        Back
      </RouterLink>
    </div>

    <div class="rounded-xl card card-padding p-4 shadow-sm">
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="onSubmit">
        <div>
          <label class="label" for="email">Email</label>
          <input id="email" v-model.trim="form.email" type="email" class="input mt-1" />
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>

        <div v-if="!isEdit">
          <label class="label" for="password">Password</label>
          <input id="password" v-model.trim="form.password" type="password" class="input mt-1" />
          <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        </div>

        <div>
          <label class="label" for="firstName">First name</label>
          <input id="firstName" v-model.trim="form.firstName" class="input mt-1" />
          <p v-if="errors.firstName" class="field-error">{{ errors.firstName }}</p>
        </div>

        <div>
          <label class="label" for="lastName">Last name</label>
          <input id="lastName" v-model.trim="form.lastName" class="input mt-1" />
          <p v-if="errors.lastName" class="field-error">{{ errors.lastName }}</p>
        </div>

        <div>
          <label class="label" for="role">Role</label>
          <select id="role" v-model="form.role" class="input mt-1">
            <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <input id="isActive" v-model="form.isActive" type="checkbox" class="h-4 w-4" />
          <label for="isActive" class="text-sm">Active</label>
        </div>

        <div class="sm:col-span-2 pt-2">
          <button class="btn" :disabled="submitting">
            {{ isEdit ? 'Save changes' : 'Create user' }}
          </button>
          <p v-if="serverError" class="mt-2 text-sm text-[rgb(var(--danger))]">{{ serverError }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROLES, type Role } from '@/constants/roles'
import { createUser, getUser, updateUser, type User } from '@/services/user'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const roles = ROLES
const route = useRoute()
const router = useRouter()
const id = route.params.id as string | undefined
const isEdit = computed(() => !!id)

type Form = {
  email: string
  password?: string
  firstName: string
  lastName: string
  role: Role
  isActive: boolean
}

const form = reactive<Form>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'customer',
  isActive: true,
})

const errors = reactive<Partial<Record<keyof Form, string>>>({})
const submitting = ref(false)
const serverError = ref('')

function validate() {
  errors.email = form.email ? '' : 'Email is required'
  if (!isEdit.value) errors.password = form.password ? '' : 'Password is required'
  errors.firstName = form.firstName ? '' : 'First name is required'
  errors.lastName = form.lastName ? '' : 'Last name is required'
  return !errors.email && !errors.password && !errors.firstName && !errors.lastName
}

async function load() {
  if (!isEdit.value) return
  const u = await getUser(id!)
  const { email, firstName, lastName, role, isActive } = u as User
  Object.assign(form, { email, firstName, lastName, role, isActive, password: '' })
}

async function onSubmit() {
  serverError.value = ''
  if (!validate()) return
  submitting.value = true
  try {
    if (isEdit.value) {
      const { password, ...payload } = form
      await updateUser(id!, payload)
    } else {
      await createUser(form as Required<Form>)
    }
    router.replace('/users')
  } catch (e: any) {
    serverError.value = e?.response?.data?.error?.message || 'Failed'
  } finally {
    submitting.value = false
  }
}

onMounted(load)
</script>
