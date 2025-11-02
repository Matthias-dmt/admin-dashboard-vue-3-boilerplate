<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold tracking-tight">Users</h1>
      <RouterLink
        to="/users/create"
        class="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
      >
        New user
      </RouterLink>
    </div>

    <div class="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <form class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3" @submit.prevent="refresh()">
        <input v-model.trim="filters.search" placeholder="Search email…" class="input" />
        <select v-model="filters.sort" class="input">
          <option :value="''">Sort</option>
          <option value="created_at:desc">Created desc</option>
          <option value="created_at:asc">Created asc</option>
          <option value="email:asc">Email asc</option>
          <option value="email:desc">Email desc</option>
        </select>
        <button class="btn">Apply</button>
      </form>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left text-gray-600">
              <th class="px-2 py-2">Email</th>
              <th class="px-2 py-2">Name</th>
              <th class="px-2 py-2">Role</th>
              <th class="px-2 py-2">Active</th>
              <th class="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in rows" :key="u.id" class="border-t border-black/5">
              <td class="px-2 py-2">{{ u.email }}</td>
              <td class="px-2 py-2">{{ u.firstName }} {{ u.lastName }}</td>
              <td class="px-2 py-2">{{ u.role }}</td>
              <td class="px-2 py-2">
                <span :class="u.isActive ? 'text-emerald-600' : 'text-gray-500'">{{
                  u.isActive ? 'Yes' : 'No'
                }}</span>
              </td>
              <td class="px-2 py-2 text-right">
                <div class="inline-flex gap-2">
                  <RouterLink :to="`/users/${u.id}/edit`" class="text-blue-600 hover:underline"
                    >Edit</RouterLink
                  >
                  <button class="text-red-600 hover:underline" @click="onDelete(u.id)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="rows.length === 0">
              <td colspan="5" class="px-2 py-6 text-center text-gray-500">No users</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex items-center justify-end gap-2">
        <button class="btn" :disabled="meta.currentPage <= 1" @click="go(meta.currentPage - 1)">
          Prev
        </button>
        <span class="text-sm text-gray-600">Page {{ meta.currentPage }} / {{ meta.lastPage }}</span>
        <button
          class="btn"
          :disabled="meta.currentPage >= meta.lastPage"
          @click="go(meta.currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deleteUser, listUsers, type User } from '@/services/user'
import { onMounted, reactive, ref } from 'vue'

const filters = reactive({ page: 1, perPage: 20, search: '', sort: '' })
const rows = ref<User[]>([])
const meta = reactive({ total: 0, perPage: 20, currentPage: 1, lastPage: 1 })
const loading = ref(false)

async function refresh() {
  loading.value = true
  const res = await listUsers({
    page: filters.page,
    perPage: filters.perPage,
    search: filters.search || undefined,
    sort: filters.sort || undefined,
  })
  rows.value = res.data
  Object.assign(meta, res.meta)
  loading.value = false
}

function go(p: number) {
  filters.page = p
  refresh()
}
async function onDelete(id: string) {
  if (!confirm('Delete user?')) return
  await deleteUser(id)
  refresh()
}

onMounted(refresh)
</script>
