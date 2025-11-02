<template>
  <div v-if="open" class="fixed inset-0 z-30 bg-black/30 lg:hidden" @click="emit('close')" />

  <aside
    ref="sidebarRef"
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-black/10 bg-white p-4 shadow-lg transition-transform',
      open ? 'translate-x-0' : '-translate-x-full',
    ]"
    aria-label="Sidebar"
  >
    <nav class="space-y-1">
      <RouterLink
        to="/"
        class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-black/5"
        :class="{ 'bg-black/5 font-medium': $route.name === 'dashboard' }"
      >
        <span>Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/users"
        class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-black/5"
        :class="{ 'bg-black/5 font-medium': $route.name?.toString()?.startsWith('users-') }"
      >
        <span>Users</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const sidebarRef = ref<HTMLElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  if (!sidebarRef.value) return
  const target = e.target as HTMLElement
  if (!sidebarRef.value.contains(target)) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
